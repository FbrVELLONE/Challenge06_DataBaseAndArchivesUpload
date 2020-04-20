import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Type must be income or outcome');
    }
    if (value < 0) {
      throw new AppError('Value must be positive');
    }
    if (
      type === 'outcome' &&
      (await transactionsRepository.getBalance()).total - value < 0
    ) {
      throw new AppError('Cant do this operation, balance is negative');
    }

    let uniqueCat = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!uniqueCat) {
      uniqueCat = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(uniqueCat);
    }

    const createdTrans = transactionsRepository.create({
      title,
      value,
      type,
      category: uniqueCat,
    });

    await transactionsRepository.save(createdTrans);

    return createdTrans;
  }
}

export default CreateTransactionService;
