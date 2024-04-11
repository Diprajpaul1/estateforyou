import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import Navigation from "../Auth/Navigation";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        }
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
      <>
        <Navigation />
        <div className="md:ml-[20rem] flex flex-col md:flex-row">
          <div className="md:w-full p-3">
            <div className="h-12 section-title text-3xl">Manage Categories</div>
            <CategoryForm
                value={name}
                setValue={setName}
                handleSubmit={handleCreateCategory}
            />
            <br />
            <hr />

            <div className="flex flex-wrap">
              {categories?.map((category) => (
                  <div key={category._id}>
                    <button
                        className="bg-white border border-blue-500 text-blue-500 py-2 px-4 rounded-lg m-3 outline hover:bg-pink-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                        onClick={() => {
                          setModalVisible(true);
                          setSelectedCategory(category);
                          setUpdatingName(category.name);
                        }}
                    >
                      {category.name}
                    </button>
                  </div>
              ))}
            </div>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
              <CategoryForm
                  value={updatingName}
                  setValue={(value) => setUpdatingName(value)}
                  handleSubmit={handleUpdateCategory}
              />
              <button
                  className="bg-blue-500 border text-white py-2 px-4 rounded-lg m-3 outline hover:bg-blue-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </Modal>
          </div>
        </div>
      </>
  );
};

export default CategoryList;
