const MeatType = ({ meatTypes }) => {
  return (
    <div>
      <div className="grid grid-cols-2">
        {meatTypes.map((meatType) => (
          <div
            className="border-blue-500 border-2 m-1 rounded-lg"
            key={meatType}
          >
            <div className="card">
              <div className="card-body">
                <h5 className="card-title font-bold text-3xl text-center">
                  {meatType}
                </h5>
                <button
                  type="button"
                  className="bg-blue-500 text-white text-sm rounded-lg p-1 hover:bg-blue-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeatType;
