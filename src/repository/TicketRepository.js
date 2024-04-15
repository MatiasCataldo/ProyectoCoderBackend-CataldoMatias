import GenericRepository from "./GenericRepository.js";

export default class TicketRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
}