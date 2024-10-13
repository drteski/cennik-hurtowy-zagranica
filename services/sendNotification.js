import prisma from '@/db'
import {sendEmail} from '@/lib/email'
import {render} from 'jsx-email'
import EmailTemplate from '@/components/email/EmailTemplate'
import {userProductsFilter} from "@/services/userProductsFilter";

const getChangedPrices = (client) => {
    return new Promise(async (resolve, reject) => {
        const test = await prisma.product.findMany({
            where: {}, include: {
                names: {
                    where: {
                        lang: client.iso,
                    },
                },
                prices: {
                    where: {
                        lang: client.iso,
                        NOT: {
                            OR: [
                                {
                                    newPrice: 0,
                                },
                                {
                                    oldPrice: 0,
                                },
                            ],
                        },
                    },
                },
            }
        })
        const products = await userProductsFilter(client.id, client.iso, "", true)
        // console.dir(test[0], {depth: null})
        if (products.length === 0) {
            reject(`No products to send to ${client.name} - ${client.email} - ${client.iso}`)
        } else {
            resolve({products, client})
        }
    })
}

const sendNotification = ({products, client}) => {
    return new Promise(async (resolve) => {

        const html = await render(<EmailTemplate data={...products} locale={client.locale}
                                                 name={client.name} currency={client.currency}/>)
        await sendEmail({
            to: client.email, subject: `${client.subject} ${client.name}`, html: `${html}`
        })
        console.log(`Wysłano powiadomienie do - ${client.iso} - ${client.email}`)

        resolve(products)
    })
}

export const notifyClient = async () => {
    const users = await prisma.user.findMany({
        include: {
            country: true,
            userProducts: {
                include: {
                    country: true
                }
            },
        }
    })
    const clients = []
    users.forEach(user => {
        const {id, email, sendNotification, userProducts} = user
        if (!sendNotification) return
        const countries = user.country;
        countries.forEach(country => {
            const {iso, name, currency, locale, subject} = country

            userProducts.forEach(userProduct => {
                if (userProduct.country[0].id === country.id)
                    clients.push({
                        id, email, sendNotification, userProducts: [userProduct], iso, name, currency, locale, subject
                    })
            })
        })

    })
    for await (const client of clients) {

        await getChangedPrices(client).then(async (data) => {
                await sendNotification(data)
            }
        ).catch(error => console.log(error))
    }

}
