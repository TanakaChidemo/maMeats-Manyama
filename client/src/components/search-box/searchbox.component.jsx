import propTypes from "prop-types";
const SearchBox = ({ placeholder, handleChange }) => (
  <input
    type="search"
    placeholder={placeholder}
    onChange={handleChange}
    className="border-2 rounded-xl p-2 w-1/2 mx-auto my-2 text-center bg-opacity-0 hover:bg-opacity-10 hover:bg-blue-200 hover:shadow-lg transition duration-500 ease-in-out"
  />
);

SearchBox.propTypes = {
  placeholder: propTypes.string,
  handleChange: propTypes.func,
};

export default SearchBox;
