const prisma = require('../prisma/prismaClient')

const createCategory = async (data) => {

    return await prisma.Category.create({data})
}

module.exports = {
    createCategory
}