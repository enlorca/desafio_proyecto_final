import { useContext } from 'react';
import Bookcard from '../../Bookcard';
import { ECommerceContext } from '../../../Context/ECommerceContext';
import { Button } from '@/components/ui/button';
export const AdminBooks = () => {
  const { books } = useContext(ECommerceContext);
  return (
    <div className="flex flex-col gap-4 px-4 md:px-20">
      <h1 className="font-bold text-2xl">Mantenedor Libros</h1>
      <div className="flex justify-end">
        <Button size="sm" className="bg-blue-500">
          Añadir libro
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex gap-4">
          {books.map((book) => (
            <Bookcard
              key={book.bookId}
              book={book}
              btnEditBook={true}
              btnDeleteBook={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
