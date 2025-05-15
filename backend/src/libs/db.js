// humara purana PrismaClient()  globalForPrisma.prisma iske andar sytore ho jata hai kya jisse ki ye baar baar refresh nhi hota or ye na hi new PrismaClient() bnata hai

import {PrismaClient} from "../generated/prisma/index.js"
//1->  first humne globalThis ko hmune ek variable pe dala globalThis ek js ka bulidin object hai jo har environment ke liye global object return karta hai
// 2-> second humne ye bola ki agar  humara globalThis.prisma(.prisma ke badle kuch or naam bhi likh sakte hai hum) empty hai to new prismaClient() create kar do
// prismaClient - new PrismaClient() ek database client return karta hai jiske through tu apne database me query kar sakta hai — jaise .findMany(), .create(), .update() etc.
// agar prismaClient empty nhi hota to tum purana prisma client create karte 
// 3-> globalThis.prisma ke andar db ko daal do

const globalForPrisma=globalThis;
export const db=globalForPrisma.prisma || new PrismaClient();
if(process.env.NODE_ENV !== "production") globalForPrisma.prisma=db;  //is poore 4 line ke code se kya hoga ki jo hmara new PrismaClient() hai vo baar baar create nhi hoga //

