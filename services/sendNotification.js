import prisma from '@/db'
import {sendEmail} from '@/lib/email'
import {render} from 'jsx-email'
import EmailTemplate from '@/components/email/EmailTemplate'
import {userProductsFilter} from "@/services/userProductsFilter";

const getChangedPrices = (client) => {
    return new Promise(async (resolve, reject) => {
        const data = await prisma.product.findMany({
            where: {}, include: {
                names: true,
                prices: true
            }
        })
        const products = userProductsFilter(data, client, client.iso)
        // const products = data.map((product) => {
        //     const {id, sku, ean, names, prices} = product;
        //     const pricesIndex = prices.findIndex(price => price.lang === client.lang)
        //     const namesIndex = names.findIndex(name => name.lang === client.lang)
        //     return {
        //         id: id.toString(),
        //         sku,
        //         ean,
        //         title: names[namesIndex].name,
        //         currency: prices[pricesIndex].currency,
        //         newPrice: prices[pricesIndex].newPrice,
        //         oldPrice: prices[pricesIndex].oldPrice,
        //         difference: prices[pricesIndex].oldPrice - prices[pricesIndex].newPrice,
        //
        //     };
        // });

        const productsWithDifferences = products.filter(
            (product) => product.price.difference !== 0
        );
        console.log(productsWithDifferences)

        if (productsWithDifferences.length === 0) {
            reject('No products to send')
        } else {
            resolve({productsWithDifferences, client})
        }
    })
}

const sendNotification = ({productsWithDifferences, clients}) => {
    return new Promise(async (resolve) => {
        for (const client of clients.emails) {
            const html = await render(<EmailTemplate data={...productsWithDifferences} locale={clients.locale}
                                                     name={clients.name} currency={clients.currency}/>)
            await sendEmail({
                to: client, subject: `${clients.subject} ${clients.name}`, html: `${html}`
            })
            console.log(`Wysłano powiadomienie do - ${clients.lang} - ${client}`)
        }
        resolve(productsWithDifferences)
    })
}

export const notifyClient = async () => {
    const users = await prisma.user.findMany({
        include: {
            country: true,
            userProducts: true,
        }
    })
    const clients = []
    users.forEach(user => {
        const {email, sendNotification, userProducts} = user
        const countries = user.country;
        countries.forEach(country => {
            const {iso, name, currency, locale, subject} = country
            clients.push({
                email, sendNotification, userProducts, iso, name, currency, locale, subject
            })
        })

    })

    clients.forEach(async (client) => await getChangedPrices(client).then(data => sendNotification(data)).catch(error => console.log(error)))

}
