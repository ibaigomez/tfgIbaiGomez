import { createClient } from '@crystallize/js-api-client';

const apiClient = createClient({
  tenantIdentifier: 'tfg-ibair',
});

export async function getBlogs() {
  const query = `
  {
    catalogue(path: "/blog", language: "en") {
      ... on Folder {
        children {
          ... on Product {
            name
            path
            defaultVariant {
              images {
                url
              }
            }
            components {
              name
              content {
                ... on SingleLineContent { text }
                ... on DatetimeContent { datetime }
                ... on RichTextContent { json }
                
              }
            }
          }
        }
      }
    }
  }
  `;
  const response = await apiClient.catalogueApi(query);
  return response.catalogue.children;
}
