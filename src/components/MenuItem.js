import React from "react";

const MenuItem = ({
  item,
  selectedItems = {},
  handleCheckboxChange,
  handleTimeCheckboxChange,
}) => {
  const preparationTimes = [
    { label: "Morning", value: "morning" },
    { label: "Noon", value: "noon" },
    { label: "Evening", value: "evening" },
  ];

  // Safeguard to handle undefined selectedItems
  const itemSelections = selectedItems[item.foodId] || {};

  return (
    <li key={item.foodId}>
      <input
        type="checkbox"
        onChange={() => handleCheckboxChange(item)}
        checked={itemSelections.checked || false}
      />
      <img
        src={item.foodImg}
        alt={item.foodName}
        style={{ width: "100px", height: "100px" }}
      />
      <h2>{item.foodName}</h2>
      <p>Price: ${item.foodPrice.toFixed(2)}</p>
      <div>
        <h4>Food Time:</h4>
        {preparationTimes.map((time) => (
          <label key={time.value}>
            <input
              type="checkbox"
              onChange={(e) => handleTimeCheckboxChange(e, time.value)}
              checked={itemSelections[time.value] || false}
              disabled={!itemSelections.checked}
            />
            {time.label}
          </label>
        ))}
      </div>
    </li>
  );
};

export default MenuItem;
