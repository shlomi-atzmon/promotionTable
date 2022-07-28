import { Fragment, Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom";
import { useMutation } from "react-query";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import DialogBox from "../Modals/DialogBox";
import moonactive from "../../api/moonactive";

interface Props {
  id: string;
  index: number;
  path: string;
  setEdit: Dispatch<SetStateAction<string | null>>;
  handleDelete: () => void;
  handleDuplicate: (index: number, duplicatedRowId: string) => void;
}

const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(" ");

const TableDropdownActions = ({
  id,
  index,
  path,
  setEdit,
  handleDelete,
  handleDuplicate,
}: Props) => {
  const [deleteModel, setDeleteModel] = useState<boolean>(false);

  const { mutate: duplicate } = useMutation(
    async (id: string) => {
      return await moonactive.request({
        url: `${path}/duplicate/${id}`,
        method: "POST",
      });
    },
    {
      onSuccess: ({ data }) => handleDuplicate(index, data.id),
    }
  );

  const { mutate: remove } = useMutation(
    async (id: string) => {
      return await moonactive.request({
        url: `${path}/${id}`,
        method: "DELETE",
      });
    },
    {
      onSuccess: () => handleDelete(),
    }
  );

  return (
    <>
      {deleteModel &&
        ReactDOM.createPortal(
          <DialogBox
            id={id}
            title="Are You Sure"
            body="Do you really want to delete these record?"
            setDeleteModel={setDeleteModel}
            onDelete={remove}
          />,
          document.getElementById("root-modal")!
        )}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
            <div className="py-1">
              <Menu.Item as="div">
                {({ active }) => (
                  <div
                    onClick={() => setEdit(id)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
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
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                  >
                    Duplicate
                  </div>
                )}
              </Menu.Item>
            </div>
            <div className="py-1">
              <Menu.Item as="div">
                {({ active }) => (
                  <div
                    onClick={() => setDeleteModel(true)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
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
    </>
  );
};

export default TableDropdownActions;
