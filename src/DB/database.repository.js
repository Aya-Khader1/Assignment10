
export const findOne = async({
    model,
    filter={},
    select="",
    options={}
}={})=>{
    const doc = model.findOne(filter)
    if(select.length) doc.select(select);
    if(options.populate) doc.populate(options.populate)
    if(options.lean) doc.lean()
    
    return await doc.exec()
}


export const create = async({
    model,
    data,
    options={validateBeforeSave:true}
}={})=>{
    return await model.create(data,options)
}
export const createOne = async({
    model,
    data,
    options={validateBeforeSave:true}
}={})=>{

    const [doc] = (await model.create(data,options)) || {};
    return doc;
}

export const findById = async({
    model,
    id,
    select="",
    options={}
}={})=>{
    const doc = model.findById(id)
    if(select.length) doc.select(select);
    if(options.populate) doc.populate(options.populate)
    if(options.lean) doc.lean()
    
    return await doc.exec()
}

export const find = async({
    model,
    filter={},
    select="",
    options={}
}={})=>{
    const doc = model.find(filter)
    if(select.length) doc.select(select);
    if(options.populate) doc.populate(options.populate)
    if(options.lean) doc.lean()
    if(options?.limit) doc.limit(limit)
    if(options?.skip) doc.skip(skip)

    return await doc.exec()
}

export const insertMany = async({
    model,
    data,
}={})=>{
    return await model.insertMany(data)
}


export const updateOne = async({
    model,
    filter,
    update="",
    options={}
}={})=>{
    return await  model.updateOne(
        filter,
        {...update,$inc:{_v:1}},
        options)
}

export const findOneAndUpdate = async({
    model,
    filter,
    update="",
    options={}
}={})=>{
    return await  model.findOneAndUpdate(
        filter,
        {...update,$inc:{_v:1}},
        {...options,new:true,runValidators:true})
}

export const findByIdandUpdate = async({
    model,
    id,
    update="",
    options={}
}={})=>{
    return await  model.findOneandUpdate(
        id,
        {...update,$inc:{_v:1}},
        {...options,new:true,runValidators:true})
}

export const deleteOne = async({
    model,
    filter,
}={})=>{
    return await  model.deleteOne(filter)
    
}

export const deleteMany = async({
    model,
    filter,
}={})=>{
    return await  model.deleteMany(filter)
    
}
export const findOneAndDelete = async({
    model,
    filter,
}={})=>{
    return await  model.findOneAndDelete(filter)

}