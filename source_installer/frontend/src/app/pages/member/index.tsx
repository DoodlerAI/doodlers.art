import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMembers } from "../../actions";
import { RootState } from "app/store";
import { useTable, useGlobalFilter } from "react-table";
import { Input } from "@chakra-ui/react";
import "./index.scss";

const Member = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.authReducer);
  const tokenState = useSelector((state: RootState) => state.tokenReducer);
  const [data, setData] = useState<any[]>([]);

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id_number",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Date Joined",
      accessor: "joiningTime",
    },
  ];

  useEffect(() => {
    const initialize = async () => {
      const data = await getMembers();
      data.users.map((user: any, i: number) => {
        user.id_number = i + 1;
      });
      // console.log("data.users", data.users);
      data.users.map((user: any) => {
        user.joiningTime = new Date(user.joiningTime).toLocaleDateString();
      });
      setData(data.users);
    };
    initialize();
  }, [authState.isLoggedIn]);

  const columns: any = useMemo(() => COLUMNS, []);
  const tableInstance = useTable({ columns, data });

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     state,
//     prepareRow,
//     setGlobalFilter,
//   } = useTable({ columns, data }, useGlobalFilter);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data
    },
    useGlobalFilter
  );

  const { globalFilter } = state;

  const goToEdit = (row: any) => {
    navigate(`/editUser/${row.id}`, {
      state: {
        ...row.values,
        id: data[row.id]._id,
        accessType: data[row.id].accessType,
      },
    });
  };

  return (
    <div
      id="members"
      style={{
        textAlign: "center",
        fontSize: "20px",
        paddingTop: "20px",
        width: "80%",
        margin: "auto",
        marginTop: "20px",
        overflow: 'auto',
        height: '100vh'
      }}
    >
      <div className="search-container" style={{ textAlign: "left" }}>
        <Input
          style={{
            color: "white",
            width: "30%",
          }}
          value={globalFilter || ""}
          placeholder="Recipient's email"
          _placeholder={{ opacity: 1, color: "gray.500" }}
          aria-label="Recipient's email"
          aria-describedby="basic-addon2"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, tr_index) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, th_index) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => goToEdit(row)}>
                {row.cells.map((cell: any, td_index: number) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Member;
