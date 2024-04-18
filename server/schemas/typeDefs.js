const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
},

type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
type Query {
    me: User
    book: [Book]
    users: [User]
    user(_id: ID!): User
}
type Auth {
    token: ID
    user: User
}

type Mutation {
    login(email: String, password: String): Auth
    createUser(username: String!, email: String!, password: String!): User
    saveBook(bookData: BookInput): User
    deleteBook(bookId: ID!): User
   }

input BookInput {
    authors: [String]
    description: String
    title: String
    bookId: ID
    image: String
    link: String
}
`;

module.exports = typeDefs;
