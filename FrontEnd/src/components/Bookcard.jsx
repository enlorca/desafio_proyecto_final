/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import {
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ECommerceContext } from '@/Context/ECommerceContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const Bookcard = ({
  book,
  btnAddCart,
  btnEditBook,
  btnDeleteBook,
  displayPrice,
  displayLanguage,
  displayQuantitySold,
  displayPubDate,
}) => {
  const navigate = useNavigate();
  const { addToCart, addCartLocal } = useContext(ECommerceContext);

  const handleAddToCart = () => {
    addToCart(book, 1);
  };

  return (
    <Card className="w-full max-w-xs hover:shadow-lg cursor-pointer hover:scale-[101%]">
      <div className="grid w-full">
        <div className="relative w-full">
          <img
            alt="Book cover"
            className="w-full object-fit"
            height={400}
            src={process.env.URL_SITE + book.img}
            style={{
              aspectRatio: '400/400',
              objectFit: 'contain',
            }}
            width={400}
            onClick={() => navigate(`/book/${book.book_id}`)}
          />
        </div>
      </div>
      <CardContent className="p-4 flex flex-col justify-between">
        <CardTitle className="text-base font-semibold text-center">
          {book.title}
        </CardTitle>
        <CardTitle className="text-sm font-medium text-center">
          {book.author}
        </CardTitle>
        {displayQuantitySold ? (
          <CardDescription className="text-sm font-semibold text-blue-500 text-center mb-2">
            Vendidos: {book.quantitysold}
          </CardDescription>
        ) : null}
        {displayLanguage ? (
          <CardDescription className="text-sm font-medium text-center">
            Idioma: {book.language}
          </CardDescription>
        ) : null}
        {displayPubDate ? (
          <CardDescription className="text-sm font-semibold text-blue-500 text-center mb-2">
            Publicado: {book.pub_date}
          </CardDescription>
        ) : null}

        <div className="flex justify-between items-center py-2">
          {displayPrice ? (
            <span className="text-xl font-medium">${book.price}</span>
          ) : null}
          {btnAddCart ? (
            <Button
              size="xs"
              className="bg-blue-500 hover:bg-blue-600 px-3 py-2"
              onClick={(e) => handleAddToCart(book)}
            >
              Agregar al carrito
            </Button>
          ) : null}
          {btnEditBook ? (
            <Button
              size="sm"
              className="m-auto bg-lime-700 hover:bg-lime-800 mt-4"
              onClick={() => navigate(`/managerbooks/edit/${book.book_id}`)}
            >
              Editar
            </Button>
          ) : null}
          {btnDeleteBook ? (
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => navigate(`/deleteBook/${book.book_id}`)}
            >
              Eliminar
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default Bookcard;
