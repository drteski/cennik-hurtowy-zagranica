import prisma from '@/db'
import {sendEmail} from '@/lib/email'
import {render} from 'jsx-email'
import EmailTemplate from '@/components/email/EmailTemplate'

const getChangedPrices = (clients) => {
    return new Promise(async (resolve, reject) => {
        const data = await prisma.product.findMany({
            where: {}, include: {
                names: true,
                prices: true
            }
        })
        const products = data.map((product) => {
            const {id, sku, ean, names, prices} = product;
            const pricesIndex = prices.findIndex(price => price.lang === clients.lang)
            const namesIndex = names.findIndex(name => name.lang === clients.lang)
            return {
                id: id.toString(),
                sku,
                ean,
                title: names[namesIndex].name,
                currency: prices[pricesIndex].currency,
                newPrice: prices[pricesIndex].newPrice,
                oldPrice: prices[pricesIndex].oldPrice,
                difference: prices[pricesIndex].oldPrice - prices[pricesIndex].newPrice,

            };
        });

        const productsWithDifferences = products.filter(
            (product) => product.difference !== 0
        );

        if (productsWithDifferences.length === 0) {
            reject('No products to send')
        } else {
            resolve({productsWithDifferences, clients})
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
    const clients = await prisma.mailingList.findMany({
        include: {
            country: true
        }
    })
    clients.filter((client) => client.emails.length !== 0).map((client) => {

        return {
            lang: client.country.iso,
            name: client.country.name,
            locale: client.country.locale,
            currency: client.country.currency,
            emails: client.emails,
            subject: client.subject
        }
    }).forEach(async (client) => await getChangedPrices(client).then((data) => sendNotification(data)).catch(error => console.log(error)))
}
