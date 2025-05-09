import Client from '@ovhcloud/node-ovh'

const OVHClient = Client({
    appKey: process.env.OVH_API_APPLICATION_KEY,
    appSecret: process.env.OVH_API_APPLICATION_SECRET,
    consumerKey: process.env.OVH_API_CONSUMER_KEY,
})

export { OVHClient }
