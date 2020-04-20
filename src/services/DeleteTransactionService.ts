import { getRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface RequestDTO {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    if (!isUuid(id)) {
      throw new AppError('Wrong ID');
    }

    const uniqTrans = await transactionsRepository.findOne(id);

    if (!uniqTrans) {
      throw new AppError('Id doesnt exists in this DB');
    }

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
