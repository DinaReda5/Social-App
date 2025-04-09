

export const create =async ({model,query={}}={}) => {
    return await model.create(query)
}