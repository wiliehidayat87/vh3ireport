'use client';
import { useEffect, useState } from 'react'

export interface IDetail {
  Sumdate : any,
  ContentLabel: any,
  Keyword : any,
  Subject: any,
  MsgStatus : any,
  Closereason: any,
  Price: any,
  TheRetry : any,
  Total: any
}

export interface IStats {
  SumDate: any,
  Keys: any,
  Values: any,
  Desc: any,
}

export default function Dashboard() {

  const [schedules, setSchedules] = useState([])
  const [detail, setDetail] = useState([])
  const [stats, setStats] = useState([])

  useEffect(() => {
    onInit()
  }, [])

  const onInit = async () => {
    Promise.all([
      getSchedules(),
      getStats(),
    ]).then(([
      schedules,
      stats,
    ]) => {
      setSchedules(schedules),
      setStats(stats)
    })
      .catch(err => {
        setSchedules([]);
        setStats([]);
      });
  }
  
  const getStats = async () => {
    const resData = await fetch(`/api/getstats`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    
    })

    return await resData.json()
  }

  const getSchedules = async () => {
    const resData = await fetch(`/api/getschedule`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },

    })

    return await resData.json()
  }

  const getSummaryDetail = async (cl : any, keyword : any) => {
    const resData = await fetch(`/api/getsummarydetail/${cl}/${keyword}`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },

    }).then(function (response) {
      return response.json()
    }).then(function (json :any) {
      setDetail(json)
    })
  }

  const handleClick = async (cl : any, keyword : any) => {

    console.info(`Content Label : ` + cl + `, Keyword : ` + keyword)

    await getSummaryDetail(cl, keyword)
  }

  return (
    <main className="flex min-h-screen flex-col p-5">
  
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        { 
            stats && stats.map((item : any, index: any) => 
            
                    <div className="card m-2 cursor-pointer border border-gray-400 rounded-lg hover:shadow-md hover:border-opacity-0 transform hover:-translate-y-1 transition-all duration-200 bg-white">
                      <div className="m-3">
                        <span className="text-sm text-teal-800 font-mono bg-teal-100 inline rounded-full px-2 align-top float-right animate-pulse">{item.Tag}</span>
                        <h2 className="text-lg mb-2 font-bold">
                          {
                            item.Keys == "CURREV"
                              ? new Intl.NumberFormat("de-DE", {style: "currency", currency: "IDR"}).format(item.Values)
                              : new Intl.NumberFormat().format(item.Values)
                          }
                        </h2>
                      <p className="font-light font-mono text-sm text-gray-700 hover:text-gray-900 transition-all duration-200">{item.Desc}</p>
                      </div>
                    </div>
                  
            )
        }
        </div>
      </div>

      <div className="container mt-4 mx-auto relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                  Schedule Renewal
                  <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Live schedules renewal ordered ascending by " push_time " data.</p>
              </caption>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                          Push Time
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Renewal Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Renewal Desc
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Amount User
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Amount User Processed
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Group Keyword
                      </th>
                      <th scope="col" className="px-6 py-3"><span className="sr-only">&nbsp;</span></th>
                  </tr>
              </thead>
              <tbody>
                {
                    schedules && schedules.map((item : any, index: any) => 
                      
                      /*<li key={index} onClick={() => handleClick(item.Id)}>{item.AmountUsersProcessed}</li> */
                      
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {item.PushTime}
                          </th>
                          <td className="px-6 py-4">
                              {item.StatusDesc}
                          </td>
                          <td className="px-6 py-4">
                              {item.ContentLabel}
                          </td>
                          <td className="px-6 py-4">
                              {item.ContentLabelDesc}
                          </td>
                          <td className="px-6 py-4">
                              {item.AmountUsers}
                          </td>
                          <td className="px-6 py-4">
                              {item.AmountUsersProcessed}
                          </td>
                          <td className="px-6 py-4">
                              {item.Notes}
                          </td>
                          <td className="px-6 py-4">
                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" key={index} onClick={() => handleClick(item.ContentLabel, item.Notes)}>Detail</a>
                          </td>
                      </tr> 
                    )
                }
              </tbody>
          </table>
      </div>

      {
                    detail && detail.map((item : any, index: any) => 
                    <div>{item.Closereason}</div>
                    )
      }

      {
      /*
      <Table
        striped 
        lined 
        headerLined 
        compact 
        shadow={true}
        bordered={true}
        hoverable={true}
        aria-label="Example static collection table"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="single"
      >
        <Table.Header>
          <Table.Column>NAME</Table.Column>
          <Table.Column>ROLE</Table.Column>
          <Table.Column>STATUS</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row key="1">
            <Table.Cell>Tony Reichert</Table.Cell>
            <Table.Cell>CEO</Table.Cell>
            <Table.Cell>Active</Table.Cell>
          </Table.Row>
          <Table.Row key="2">
            <Table.Cell>Zoey Lang</Table.Cell>
            <Table.Cell>Technical Lead</Table.Cell>
            <Table.Cell>Paused</Table.Cell>
          </Table.Row>
          <Table.Row key="3">
            <Table.Cell>Jane Fisher</Table.Cell>
            <Table.Cell>Senior Developer</Table.Cell>
            <Table.Cell>Active</Table.Cell>
          </Table.Row>
          <Table.Row key="4">
            <Table.Cell>William Howard</Table.Cell>
            <Table.Cell>Community Manager</Table.Cell>
            <Table.Cell>Vacation</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      */
      }
        <ul>
        {/*
            schedules && schedules.map((item : any, index: any) => 
              
              <li key={index} onClick={() => handleClick(item.Id)}>{item.AmountUsersProcessed}</li> 
            )
          */
        }
        </ul>
    </main>
  )
}
