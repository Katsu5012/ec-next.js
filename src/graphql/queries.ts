import { gql } from 'urql';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      imageUrl
      stock
      description
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      imageUrl
      stock
      description
    }
  }
`;
