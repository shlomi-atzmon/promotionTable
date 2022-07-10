import { Fragment } from 'react';
import { useMutation, useQueryClient } from "react-query";
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import moonactive from "../../api/moonactive";

interface Props {
  id: string,
  path: string,
  setEdit: any
}

const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');

const TableDropdownActions = ({ id, path, setEdit }: Props) => {

  const queryClient = useQueryClient();

  const { mutate: duplicate } = useMutation(async (id: string) => {
    return await moonactive.request({
      url: `${path}/duplicate/${id}`,
      method: 'POST',
    });
  }, {
    onSuccess: () => queryClient.invalidateQueries('promotion')
  })

  const { mutate: remove } = useMutation(async (id: string) => {
    return await moonactive.request({
      url: `${path}/${id}`,
      method: 'DELETE',
    });
  }, {
    onSuccess: () => queryClient.invalidateQueries('promotion')
  })

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
          <ChevronDownIcon className='h-5 w-5' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none'>
          <div className='py-1'>
            <Menu.Item as="div">
              {({ active }) => (
                <div
                  onClick={() => setEdit(id)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  Edit
                </div>
              )}
            </Menu.Item>
            <Menu.Item as="div">
              {({ active }) => (
                <div
                  onClick={() => duplicate(id)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  Duplicate
                </div>
              )}
            </Menu.Item>
          </div>
          <div className='py-1'>
            <Menu.Item as="div">
              {({ active }) => (
                <div
                  onClick={() => remove(id)}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm cursor-pointer'
                  )}
                >
                  Delete
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default TableDropdownActions;
