import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECTID,
    dataset: 'production',
    apiVersion: '2023-12-12',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_TOKEN,
});
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder(source)