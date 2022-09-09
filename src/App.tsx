import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import { Input, Button } from "antd";
import dayjs from "dayjs";
// import { data } from "./data";
import axios from "axios";

const customObx = (_data: any) => {
  let obx: any = [];
  for (const _data2 of _data.data) {
    const _obx = _data2?.result?.obx;
    for (let i = 1; i < _obx?.length; i++) {
      const find = obx.find(
        (obxItem: any) => obxItem.testCode === _obx[i].testCode
      );
      const date = dayjs(_data2.createdAt).format("DDMMYYYY");
      _obx[i].date = _data2.createdAt;
      if (find) {
        const findDate = find.group[date];
        if (findDate) {
          find.group[date] = [...find.group[date], _obx[i]];
        } else {
          find.group[date] = [_obx[i]];
        }
      } else {
        const fomat = {
          testCode: _obx[i].testCode,
          normalRange: _obx[i].normalRange,
          unit: _obx[i].unit,
          group: { [date]: [_obx[i]] },
        };
        delete _obx.testCode;
        obx = [...obx, fomat];
      }
    }
  }
  return {
    testCode: _data.testCode,
    group: obx,
  };
};

function App() {
  const [dataTable, setDataTable] = useState<any>([]); //Map ดั้งเดิม
  const [dataTableshow, setDataTableShow] = useState<any>([]); //Map ที่แสดง
  const [keyword, setKeyword] = useState<string>();
  
  const [data2, setData2] = useState<any>();
  const getData = async () => {
      const {data} = await axios.get('http://localhost:5000/getlab')
      // setDataTable([]);
      // const data2 = {...data};
      // const data2 = Object.assign({},data)
      // const data2 = structuredClone(data)
      // setData2({...data})
      await data.result[0].data?.forEach((_data: any) => {
        //ถ้าเป็น undefine จะไม่มี index เลย error
        // const [find,indexFind] = dataTable.find((test:any) => test.testCode === _data.testCode);
        const find = dataTable.find(
          (test: any) => test.testCode === _data.testCode
        );
        if (find) {
          //  let fomat = customObx(_data)
          //  for (const defaultElement of fomat.group) {
          //    for (const [i, defaultElement2] of find.group.entries() ) {
          //      if(defaultElement.testCode === defaultElement2.testCode){
          //        find.group[i].group = {...defaultElement2.group, ...defaultElement.group }
          //        const clonetest = [...dataTable]
          //        clonetest[indexFind] = find
          //         //  test = [...test, fomat];
          //       //  setDataTable([...clonetest])
          //      }
          //    }
          //  }
        } else {
          const fomat = customObx(_data);
          delete _data.testCode;
          setDataTable((arr: any) => [...arr, fomat]);
          setDataTableShow((arr: any) =>[...arr, fomat]);
        }
      });
  };


  const filterLab = ()=>{
    if(keyword === ''){
      setDataTableShow([...dataTable])
    }else{
      let tod:any = []
      dataTable.forEach( (element:any) => {
        if(element.testCode.includes(keyword)){
            tod.push(element)
        }

        if(element.group.map((item:any)=> item.testCode).find( (item:any)=> item.includes(keyword))){
          tod.push(element);
        } 
      
      });
      setDataTableShow([...tod]);
    }
  }

  useEffect(() => {
     console.log('use effect20');
     getData();
  }, []);

  useEffect(()=>{
    // console.log('changes dataTableshow',dataTableshow);
  },[dataTableshow])

  return (
    <>
      <div >
        <Input onChange={(e)=>{ 
            setKeyword(e.target.value);
        }}/>
        <Button
          type="primary"
          onClick={() => {
            filterLab()
          }}
        >
          search
        </Button>
      </div>
      <div style={{ margin: "20px" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th rowSpan={2}>Name</th>
              <th rowSpan={2}>Reference Range</th>
              {new Array(10).fill(null).map((_, index) => {
                return <th key={index}> Date </th>;
              })}
            </tr>
            <tr>
              {new Array(10).fill(null).map((_, index) => {
                return (
                  <th key={index}>
                    {dayjs("2022-08-04").add(index, "day").format("DD-MM-YYYY")}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataTableshow.map((item: any, index: any) => {
              return (
                <Fragment key={index}>
                  <tr>
                    {item.group.length == 0 ? null : (
                      <td key={item.testCode} colSpan={12}>
                        {item.testCode}
                      </td>
                    )}
                  </tr>
                  {item.group.map((itemGroup: any, chindex: any) => {
                    return (
                      <tr key={chindex}>
                        <td>{itemGroup.testCode}</td>
                        <td>
                          {itemGroup.normalRange
                            ? itemGroup.normalRange + " " + itemGroup.unit
                            : null}
                        </td>
                        {new Array(10).fill(null).map((_, chchindex: any) => {
                          const day = dayjs("2022-08-04")
                            .add(chchindex, "day")
                            .format("DDMMYYYY");
                          if (itemGroup.group.hasOwnProperty(day)) {
                            return (
                              <td key={chchindex}>
                                {itemGroup.group[
                                  day as keyof typeof itemGroup.group
                                ].map((item: any, index1: any) => {
                                  return (
                                    <div
                                      key={item.date}
                                      style={{ display: "inline-block" }}
                                    >
                                      <span
                                        key={item.date}
                                        style={{
                                          color: item.flagLowHigh
                                            ? "red"
                                            : "black",
                                          display: "inline-block",
                                        }}
                                      >
                                        {index1 !==
                                        itemGroup.group[
                                          day as keyof typeof itemGroup.group
                                        ].length -
                                          1
                                          ? item.result + item.flagLowHigh
                                          : item.result + item.flagLowHigh}
                                      </span>
                                      {index1 !==
                                      itemGroup.group[
                                        day as keyof typeof itemGroup.group
                                      ].length -
                                        1 ? (
                                        <span>,&nbsp;</span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </td>
                            );
                          } else {
                            return <td key={chchindex}></td>;
                          }
                        })}
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
