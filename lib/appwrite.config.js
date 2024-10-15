import * as sdk from 'node-appwrite'
const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    ENDPOINT,
    BUCKET_ID
}=process.env

const client=new sdk.Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('669688ae000c190a67de').setKey('a9256865a3e823c75c15042225e3dc195b4be9a6ddfde0c223ff8ab27b1b85450c59e8a9bebd693599e953295f0d23116f08e84753a35cd6352cf6d19ef7f72e9e19cf00ff2dac53cca6df2e659a452b0568ec3f962a56a50c55aac1d2cf03d9ced6b7c955036629fb7d5a349e4af473c89e570811d9cf504101f03fe63b633d')

export const databases=new sdk.Databases(client)
export const storage=new sdk.Storage(client)
export const messaging=new sdk.Messaging(client)
export const users=new sdk.Users(client);