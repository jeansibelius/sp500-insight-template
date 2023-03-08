'use client';
import { FC, useMemo, useState } from 'react';
import useSWR from 'swr';
import Scrollable from '@/components/Scrollable';
import { ListSearch } from '@/components/List';
import Stocks from './Stocks';

const IndexCompositions: FC<{ index: string }> = ({ index }) => {
  const [search, setSearch] = useState('');
  const { data = [] } = useSWR([index, 'compositions'], compositions);
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.stock_symbol.toLowerCase().indexOf(search) !== -1
      || item.short_name.toLowerCase().indexOf(search) !== -1,
    );
  }, [search, data]);

  return (
    <>
      <ListSearch value={search} onChange={setSearch} className="my-2" />
      <Scrollable className="h-[400px]">
        <Stocks stocks={filteredData} />
      </Scrollable>
    </>
  );
};

export default IndexCompositions;

type IndexCompositionRecord = {
  exchange_symbol: string
  last_2nd_close_price: number
  last_change_day: string
  last_change_percentage: number
  last_close_price: number
  short_name: string
  stock_symbol: string
  weight: number
}

const compositions = async ([index]: [string]): Promise<IndexCompositionRecord[]> => {
  const res = await fetch(`/api/indexes/${index}/compositions`);
  const { rows } = await res.json();
  return rows.map(({ last_2nd_close_price, last_change_percentage, last_close_price, ...rest }: any) => ({
    ...rest,
    last_2nd_close_price: parseFloat(last_2nd_close_price),
    last_change_percentage: parseFloat(last_change_percentage),
    last_close_price: parseFloat(last_close_price),
  }));
};
