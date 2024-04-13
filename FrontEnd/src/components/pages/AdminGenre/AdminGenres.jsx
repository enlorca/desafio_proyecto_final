/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { ECommerceContext } from '../../../Context/ECommerceContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINT } from '../../../config/constants';
import * as Dialog from '@radix-ui/react-dialog';
import '../../ui/dialog.css';

const AdminGenres = () => {
    const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
  const { ObtenerGenerosTodosAPI, genresAll, setGenresAll } =
    useContext(ECommerceContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  

    const activarGenero = (genre_id) => {
    alertify
      .confirm(
        'Activar Genero',
        '¿Seguro que quieres activar este genero?',
        function () {
          try {
            let token = sessionStorage.getItem('token');
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            axios
              .put(`${ENDPOINT.genre}/activate/${genre_id}`, {}, { headers })
              .then((response) => {
                ObtenerGenerosTodosAPI();
                alertify.success('Genero activado exitosamente');
              })
              .catch((error) => {
                console.log(error);
                alertify.error('Error al activar genero');
              });
          } catch (error) {
            console.log(error);
            alertify.error('Error al activar genero');
          }
        },
        function () {
          alertify.confirm().close();
        }
      )
      .set({
        labels: {
          ok: 'SI',
          cancel: 'NO',
        },
      });
  };

  const desactivarGenero = (genre_id) => {
    alertify
      .confirm(
        'Desactivar Genero',
        '¿Seguro que quieres desactivar este genero?',
        function () {
          try {
            let token = sessionStorage.getItem('token');
            axios
              .delete(`${ENDPOINT.genre}/${genre_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                ObtenerGenerosTodosAPI();
                alertify.success('Genero desactivado exitosamente');
              })
              .catch((error) => {
                console.log(error);
                alertify.error('Error al desactivar genero');
              });
          } catch (error) {
            alertify.error('Error al desactivar genero');
            console.log(error);
          }
        },
        function () {
          alertify.confirm().close();
        }
      )
      .set({
        labels: {
          ok: 'SI',
          cancel: 'NO',
        },
      });
  };
  useEffect(() => {}, []);
  return (
    <div className="min-[768px]:w-full min-[768px]:h-full pb-8">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Editar Genero</Dialog.Title>
            <Dialog.Description>Editar el genero de libros</Dialog.Description>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <h1 className="font-bold text-xl text-center">Mantenedor Géneros</h1>
      <div
        className="flex justify-center pl-8 mt-4 mb-4"
        onClick={() => navigate('/managergenres/add')}
      >
        <Button size="sm" className="bg-blue-500">
          Añadir Género
        </Button>
      </div>
      <div className="pl-8 pr-8 overflow-x-auto">
        <table className="table table-fixed w-full text-center border border-gray-300 rounded">
          <thead className="bg-blue-800 text-white mt-4 ">
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Cantidad Libros Asociados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {genresAll.map((genre) => (
              <tr
                className="text-center border border-gray-300"
                key={genre.genre_id}
              >
                <td>{genre.genre_id}</td>
                <td className="w-1/12 text-left">{genre.name}</td>
                <td className="w-1/12">{genre.quantitybook}</td>
                <td className="flex justify-center">
                  <Button
                    size="sm"
                    className="m-auto bg-yellow-500 hover:bg-yellow-800  p-2"
                    onClick={() => {
                      //navigate('/managergenres/edit/' + genre.id);
                      wait().then(() => {
                        setOpen(true);
                        console.log(open);
                      });
                    }}
                  >
                    Editar
                  </Button>
                  {genre.deleted ? (
                    <Button
                      size="sm"
                      className="m-auto bg-green-500 hover:bg-green-800  pl-4 pr-4"
                      onClick={() => {
                        activarGenero(genre.genre_id);
                      }}
                    >
                      Activar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="m-auto bg-red-500 hover:bg-red-800 p-2"
                      onClick={() => {
                        desactivarGenero(genre.genre_id);
                      }}
                    >
                      Desactivar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGenres;
