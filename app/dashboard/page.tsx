'use client';
import { SetStateAction, useEffect, useState } from 'react'
import { Identifier } from 'typescript';

export interface IDetailSSS {
  Closereasons: string, 
  GrandTotal:   any,
  Total:        [],
}

export interface IDetailSSSTD {
  SummaryName:  string, 
  GrandTotal:   any,
  Total:        [],
}

export interface IDetailSS {
  Keyword:          string, 
  RowDate:          [], 
  Renewal:          IDetailSSS[],
  TotRenewal:       IDetailSSSTD,
  BillRateRenewal:  IDetailSSSTD,
  Retry:            IDetailSSS[],
  TotRetry:         IDetailSSSTD,
  BillRateRetry:    IDetailSSSTD,
}

export interface IDetail {
  Label:          string, 
  Desc:           string,
  SummarySubject: IDetailSS[],
}

export interface IStats {
  SumDate:  any,
  Keys:     any,
  Values:   any,
  Desc:     any,
}

export default function Dashboard() {
  
  const [schedules, setSchedules] = useState([])
  const [detail, setDetail] = useState<IDetail | undefined>(undefined)
  const [stats, setStats] = useState([])
  const [showCurrent, setShowCurrent] = useState(false)
  const [detailClicked, setDetailClicked] = useState(false)

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

    console.info(`Content Label : ` + cl + `, Keyword : ` + keyword)
    
    const resData = await fetch(`/api/getsummarydetail/${cl}/${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },

    }).then(function (response) {
      return response.json()
    }).then(function (json :any) {
      setDetail(json)
    }).then(function(){
      setShowCurrent(true)
      setDetailClicked(false)
    })
  }

  const handleClick = async (cl : any, keyword : any) => {

    setShowCurrent(false)
    setDetailClicked(true)
    await getSummaryDetail(cl, keyword)
    //getSummaryDetail(cl, keyword)
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
                            {detailClicked ? 
                             <div role="status">
                              <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                             : 
                             <a href="#detail" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" key={index} onClick={() => handleClick(item.ContentLabel, item.Notes)}>Detail</a>
                            }
                            
                          </td>
                      </tr> 
                    )
                }
              </tbody>
          </table>
      </div>

      {showCurrent ? 
        <div className="container mt-4 mx-auto relative overflow-x-auto shadow-md sm:rounded-lg">

          {detail?.SummarySubject && (detail.SummarySubject.map((item : IDetailSS, i : any) => 

              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                  {i == 0 ? "RENEWAL - Detail Summary - July 2023" : null}
                  <p className="mt-1 text-sm font-normal text-teal-400">{detail && (detail.Desc)} ( {detail && (detail.Label)} ) - Keyword " {item.Keyword} ".</p>
              </caption>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      Summary
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Total
                  </th>
                  {item?.RowDate && (item.RowDate.map((thedate : string) => 
                    <th scope="col" className="px-6 py-3">
                    {thedate}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>

              {item?.Renewal && (item.Renewal.map((r : IDetailSSS, i: number) => 
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {r.Closereasons}
                  </th>
                  <td className="px-6 py-4">
                      {r.GrandTotal}
                  </td>
                  {r?.Total && (r.Total.map((t : any) => 
                    <td className="px-6 py-4">
                        {t}
                    </td>
                  ))}
                </tr>
              ))}
            
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800 bg-slate-100">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-right">
                  {item?.TotRenewal && (item?.TotRenewal.SummaryName)}
                  </th>
                  <td className="px-6 py-4">
                  {item?.TotRenewal && (item?.TotRenewal.GrandTotal)}
                  </td>
                  {item?.TotRenewal.Total && (item.TotRenewal.Total.map((t : any) => 
                  <td className="px-6 py-4">
                    {t}
                  </td>
                  ))}
              </tr>

              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800 bg-slate-100">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-right">
                  {item?.BillRateRenewal && (item?.BillRateRenewal.SummaryName)}
                  </th>
                  <td className="px-6 py-4">
                  {item?.BillRateRenewal && (new Intl.NumberFormat('default', {
                      style: 'percent',
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    }).format(item?.BillRateRenewal.GrandTotal/100))}
                  </td>
                  {item?.BillRateRenewal.Total && (item.BillRateRenewal.Total.map((t : any) => 
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('default', {
                      style: 'percent',
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    }).format(t/100)}
                  </td>
                  ))}
              </tr>

              </tbody>
            </table>
          ))}

          {detail?.SummarySubject && (detail.SummarySubject.map((item : IDetailSS, i : any) => 

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              {i == 0 ? "RETRY - Detail Summary - July 2023" : null}
              <p className="mt-1 text-sm font-normal text-teal-400">{detail && (detail.Desc)} ( {detail && (detail.Label)} ) - Keyword " {item.Keyword} ".</p>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                  Summary
              </th>
              <th scope="col" className="px-6 py-3">
                  Total
              </th>
              {item?.RowDate && (item.RowDate.map((thedate : string) => 
                <th scope="col" className="px-6 py-3">
                {thedate}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>

          {item?.Retry && (item.Retry.map((r : IDetailSSS) => 
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {r.Closereasons}
              </th>
              <td className="px-6 py-4">
                  {r.GrandTotal}
              </td>
              {r?.Total && (r.Total.map((t : any) => 
                <td className="px-6 py-4">
                    {t}
                </td>
              ))}
            </tr>
          ))}

              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800 bg-slate-100">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-right">
                  {item?.TotRetry && (item?.TotRetry.SummaryName)}
                  </th>
                  <td className="px-6 py-4">
                  {item?.TotRetry && (item?.TotRetry.GrandTotal)}
                  </td>
                  {item?.TotRetry.Total && (item.TotRetry.Total.map((t : any) => 
                  <td className="px-6 py-4">
                    {t}
                  </td>
                  ))}
              </tr>

              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-slate-800 bg-slate-100">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-right">
                  {item?.BillRateRetry && (item?.BillRateRetry.SummaryName)}
                  </th>
                  <td className="px-6 py-4">
                  {item?.BillRateRetry && (new Intl.NumberFormat('default', {
                      style: 'percent',
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    }).format(item?.BillRateRetry.GrandTotal/100))}
                  </td>
                  {item?.BillRateRetry.Total && (item.BillRateRetry.Total.map((t : any) => 
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('default', {
                      style: 'percent',
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    }).format(t/100)}
                  </td>
                  ))}
              </tr>
          </tbody>
          </table>
          ))}
          
        </div>
      : 
      
      <div className="text-center">
          <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
      </div>

      }

    </main>
  )
}
