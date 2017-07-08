const graphql = require("graphql")
const axios = require("axios")
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

const users = [
    { id: "23", firstName: "Bill", age: 20 },
    { id: "24", firstName: "Samantha", age: 21 }
]
const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },

    }
})
const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                console.log("in resolve",parentValue, args)
                const request = axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                return request.then(response => {

                    return response.data
                })
            }
        }
    }
})



const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                }

            },
            resolve(parentValue, args) {
                const request = axios.get(`http://localhost:3000/users/${args.id}`)

                return request.then(response => {

                    return response.data
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})