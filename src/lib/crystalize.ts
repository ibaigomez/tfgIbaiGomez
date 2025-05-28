import { createClient } from '@crystallize/js-api-client'; //importo el cliente oficial de Crystallize

const apiClient = createClient({
  tenantIdentifier: 'tfg-ibair', //creo un cliente que accede al tenant donde creo los productos
});

export async function getSneakers() { //creo una funcion para retornar los datos recogidos de la query en otras paginas
  const query = `
   {
      catalogue(path: "/zapatungas", language: "en") {
        ... on Folder {
          children {
            ... on Product {
              name
              path
              defaultVariant {
                images {
                  url
                }
                price
              }
              variants {
                name
                sku
                isDefault
                priceVariants {
                  identifier
                  price
                }
                stockLocations {
                  identifier
                  stock
                }
                attributes {
                  attribute
                  value
                }
              }
              components {
                name
                content {
                  ... on SingleLineContent { text }
                  ... on RichTextContent { json }
                  ... on ParagraphCollectionContent {
                    paragraphs {
                      title { text }
                      body { json }
                      images {
                        variants {
                          url
                          width
                          height
                        }
                      }
                    }
                  }
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

