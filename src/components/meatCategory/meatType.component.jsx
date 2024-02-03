import PropTypes from "prop-types";
const MeatType = ({ meatTypes }) => {
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 mx-auto">
        {meatTypes.map((meatType) => (
          <div
            className=" border-blue-500 m-1 rounded-lg bg-white shadow-xl bg-transparent hover:bg-blue-100 transition duration-500 ease-in-out"
            key={meatType}
          >
            <div className="p-2">
              <h5 className="text-2xl font-bold text-center mb-4">
                {meatType}
              </h5>
              <button className="border-2 h-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-sm px-3 rounded-full">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MeatType.propTypes = {
  meatTypes: PropTypes.array.isRequired,
};

export default MeatType;
