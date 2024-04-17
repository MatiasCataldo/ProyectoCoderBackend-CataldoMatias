
export default class GenericRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = (params) =>{
        return this.dao.get(params);
    }

    getBy = (params) =>{
        return this.dao.getBy(params);
    }

    create = (doc) =>{
        return this.dao.save(doc);
    }

    update = (productId, quantity) =>{
        return this.dao.update(productId, quantity);
    }

    delete = (id) =>{
        return this.dao.delete(id);
    }
}