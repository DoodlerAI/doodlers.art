import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../../actions';
import { RootState } from 'app/store';
import { useTable, useGlobalFilter } from 'react-table';
import { Input, Tooltip } from '@chakra-ui/react';
import './index.scss';

const Member = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.authReducer);
  const tokenState = useSelector((state: RootState) => state.tokenReducer);
  const [data, setData] = useState([]);

  const COLUMNS = [
    {
      Header: 'ID',
      accessor: 'id_number',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Generation Mode',
      accessor: 'generation_mode',
    },
    {
      Header: 'Prompt',
      accessor: 'prompt',
    },
    {
      Header: 'Width',
      accessor: 'width',
    },
    {
      Header: 'Height',
      accessor: 'height',
    },
    {
      Header: 'CFG Scale',
      accessor: 'cfg_scale',
    },
    {
      Header: 'Seed',
      accessor: 'seed',
    },
    {
      Header: 'Steps',
      accessor: 'steps',
    },
    {
      Header: 'Iterations',
      accessor: 'iterations',
    },
    {
      Header: 'Sampler Name',
      accessor: 'sampler_name',
    },
    {
      Header: 'Waiting Time',
      accessor: 'waitingTime',
    },
    {
      Header: 'Status',
      accessor: 'status',
    },
    {
      Header: 'CreatedAt',
      accessor: 'createdAt',
    },
  ];

  const showStatus = (status: number) => {
    switch (status) {
      case 0:
        return 'Requested';
        break;
      case 1:
        return 'Finished';
        break;
      case 2:
        return 'Expired';
        break;
      case 3:
        return 'Ready';
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const data = await getReports();
      data.reports.map((report: any, i: number) => {
        report.id_number = i + 1;
      });
      // console.log("data.reports", data.reports);
      data.reports.map((report: any) => {
        report.createdAt = new Date(report.createdAt).toLocaleDateString();
      });
      setData(data.reports);
    };
    initialize();
  }, [authState.isLoggedIn]);

  const columns: any = useMemo(() => COLUMNS, []);
  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    setGlobalFilter,
    prepareRow,
  } = useTable({ columns, data }, useGlobalFilter);

  const { globalFilter } = state;

  return (
    <div
      id="members"
      style={{
        textAlign: 'center',
        fontSize: '20px',
        paddingTop: '20px',
        width: '95%',
        margin: 'auto',
        marginTop: '20px',
        overflow: 'auto',
        height: '100vh'
      }}
    >
      <div className="search-container" style={{ textAlign: 'left' }}>
        <Input
          style={{
            color: 'white',
            width: '30%',
          }}
          value={globalFilter || ''}
          placeholder="Search"
          _placeholder={{ opacity: 1, color: 'gray.500' }}
          aria-label="Search"
          aria-describedby="basic-addon2"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, tr_index) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, th_index) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any, td_index: number) => {
                  // console.log(td_index, cell.value);

                  if (td_index == 3) {
                    if (cell.value.length > 7) {
                      return (
                        <Tooltip
                          label={cell.value}
                          fontSize={'20px'}
                          key={td_index}
                        >
                          <td {...cell.getCellProps()}>
                            {cell.value.length > 7
                              ? cell.value.slice(0, 4) + '...'
                              : cell.value}
                          </td>
                        </Tooltip>
                      );
                    } else {
                      return (
                        <td {...cell.getCellProps()} key={td_index}>
                          {cell.value.length > 7
                            ? cell.value.slice(0, 4) + '...'
                            : cell.value}
                        </td>
                      );
                    }
                  } else if (td_index == 12) {
                    return (
                      <td {...cell.getCellProps()}>{showStatus(cell.value)}</td>
                    );
                  } else if (td_index == 11) {
                    // console.log("cell.value", cell.value);
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.value
                          ? (cell.value / 1000).toFixed(1) + 's'
                          : cell.value}
                      </td>
                    );
                  } else {
                    return <td {...cell.getCellProps()}>{cell.value}</td>;
                  }
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
