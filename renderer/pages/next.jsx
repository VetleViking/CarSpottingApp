import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { get_makes } from '../stuff/api';

function Next() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await get_makes(search);
      setData(data);
    };

    fetchData();
  }, [search]);

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      {data.map((item, id) => (
        <div key={id}>
          <h3>{item.name}</h3>
          {/* <h3>{item.make} {item.model}</h3>
          <p>{item.year}</p> */}
        </div>
      ))}
    </div>
  );
}

export default Next;
