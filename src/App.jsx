import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");

  const data = [
    {
      id: 1,
      supplier: "Company A",
      institution: "Ministry of Health",
      amount: 50000,
      date: "2024-01-01",
      status: "HIGH"
    },
    {
      id: 2,
      supplier: "Company B",
      institution: "Municipality",
      amount: 15000,
      date: "2024-02-10",
      status: "LOW"
    },
    {
      id: 3,
      supplier: "Company C",
      institution: "Education Agency",
      amount: 30000,
      date: "2024-03-05",
      status: "MEDIUM"
    }
  ];

  const filteredData = data.filter(item =>
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>ProcureWatch</h1>

        {/* SEARCH */}
        <input
            type="text"
            placeholder="Search by supplier or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              marginBottom: "20px",
              width: "300px"
            }}
        />

        {/* TABLE */}
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
          <tr>
            <th>Supplier</th>
            <th>Institution</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
          </thead>

          <tbody>
          {filteredData.map(item => (
              <tr key={item.id}>
                <td>{item.supplier}</td>
                <td>{item.institution}</td>
                <td>{item.amount}</td>
                <td>{item.date}</td>
                <td>
                <span
                    style={{
                      color:
                          item.status === "HIGH"
                              ? "red"
                              : item.status === "MEDIUM"
                                  ? "orange"
                                  : "green",
                      fontWeight: "bold"
                    }}
                >
                  {item.status}
                </span>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}

export default App;