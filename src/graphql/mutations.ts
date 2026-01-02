import { gql } from 'urql';

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      success
      message
      cartItem {
        product {
          id
          name
          price
          imageUrl
          stock
          description
        }
        quantity
        addedAt
      }
    }
  }
`;

export const LOGIN = gql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`);
