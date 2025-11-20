import { useEffect, useState, useRef } from 'react';
import { SIDEBAR_ITEMS } from '../../constants/admin.js';

export default function AdminPage() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState('2025년');
  const [selectedPeriod, setSelectedPeriod] = useState('전체 기간');
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showPeriodSelect, setShowPeriodSelect] = useState(false);
  const [activeMemberTab, setActiveMemberTab] = useState('all');
  const [activePaymentTab, setActivePaymentTab] = useState('all');
  const [aiContentToggle, setAiContentToggle] = useState(true);
  const [imageOptimizeToggle, setImageOptimizeToggle] = useState(true);
  
  const monthlyBookingsChartRef = useRef(null);
  const accommodationTypeChartRef = useRef(null);
  const monthlyBookingsChartInstance = useRef(null);
  const accommodationTypeChartInstance = useRef(null);

  useEffect(() => {
    document.title = '캠핑 관리자 대시보드';

    // ECharts 로드
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.echarts) {
        // 월별 예약 현황 차트
        if (monthlyBookingsChartRef.current) {
          monthlyBookingsChartInstance.current = window.echarts.init(monthlyBookingsChartRef.current);
          const monthlyBookingsOption = {
            animation: false,
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#e5e7eb',
              textStyle: { color: '#1f2937' }
            },
            grid: { top: 10, right: 10, bottom: 20, left: 40 },
            xAxis: {
              type: 'category',
              data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              axisLine: { lineStyle: { color: '#e5e7eb' } },
              axisLabel: { color: '#1f2937' }
            },
            yAxis: {
              type: 'value',
              axisLine: { show: false },
              axisLabel: { color: '#1f2937' },
              splitLine: { lineStyle: { color: '#e5e7eb' } }
            },
            series: [{
              name: '예약 수',
              type: 'line',
              smooth: true,
              data: [320, 280, 350, 410, 520, 680, 780, 850, 720, 580, 480, 390],
              lineStyle: { width: 3, color: 'rgba(87, 181, 231, 1)' },
              symbol: 'none',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(87, 181, 231, 0.2)' },
                    { offset: 1, color: 'rgba(87, 181, 231, 0.01)' }
                  ]
                }
              }
            }]
          };
          monthlyBookingsChartInstance.current.setOption(monthlyBookingsOption);
        }

        // 숙박시설 유형 분포 차트
        if (accommodationTypeChartRef.current) {
          accommodationTypeChartInstance.current = window.echarts.init(accommodationTypeChartRef.current);
          const accommodationTypeOption = {
            animation: false,
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderColor: '#e5e7eb',
              textStyle: { color: '#1f2937' }
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 'center',
              textStyle: { color: '#1f2937' }
            },
            series: [{
              name: '숙박시설 유형',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: { show: false },
              emphasis: { label: { show: false } },
              labelLine: { show: false },
              data: [
                { value: 450, name: '글램핑', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
                { value: 320, name: '펜션', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
                { value: 280, name: '캠핑장', itemStyle: { color: 'rgba(251, 191, 114, 1)' } },
                { value: 208, name: '카라반', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
              ]
            }]
          };
          accommodationTypeChartInstance.current.setOption(accommodationTypeOption);
        }

        // 윈도우 리사이즈 시 차트 크기 조정
        const handleResize = () => {
          if (monthlyBookingsChartInstance.current) {
            monthlyBookingsChartInstance.current.resize();
          }
          if (accommodationTypeChartInstance.current) {
            accommodationTypeChartInstance.current.resize();
          }
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // 외부 클릭 시 셀렉트 박스 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-select')) {
        setShowYearSelect(false);
        setShowPeriodSelect(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentDate = new Date();
  const dateString = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][currentDate.getDay()]}요일`;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }

        body {
          font-family: 'Noto Sans KR', sans-serif;
        }

        .sidebar-item.active {
          background-color: rgba(79, 70, 229, 0.1);
          color: #4F46E5;
          border-left: 3px solid #4F46E5;
        }

        .custom-checkbox {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .custom-checkbox input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          background-color: #fff;
          border: 2px solid #d1d5db;
          border-radius: 4px;
        }

        .custom-checkbox input:checked~.checkmark {
          background-color: #4F46E5;
          border-color: #4F46E5;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .custom-checkbox input:checked~.checkmark:after {
          display: block;
        }

        .custom-checkbox .checkmark:after {
          left: 6px;
          top: 2px;
          width: 6px;
          height: 12px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e5e7eb;
          transition: .4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked+.toggle-slider {
          background-color: #4F46E5;
        }

        input:checked+.toggle-slider:before {
          transform: translateX(24px);
        }

        .custom-select {
          position: relative;
          display: inline-block;
        }

        .custom-select-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 10;
          margin-top: 4px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          display: none;
        }

        .custom-select.active .custom-select-options {
          display: block;
        }

        .custom-select-option {
          padding: 0.5rem 1rem;
          cursor: pointer;
        }

        .custom-select-option:hover {
          background-color: #f3f4f6;
        }

        .tab-active {
          color: #4F46E5;
          border-bottom: 2px solid #4F46E5;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-6 flex items-center space-x-3">
          <span className="text-2xl font-['Pacifico'] text-primary">logo</span>
          <span className="text-lg font-medium">관리자 대시보드</span>
        </div>
        <div className="mt-6">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveSidebarItem(item.id)}
              className={`sidebar-item px-6 py-3 flex items-center space-x-3 cursor-pointer ${
                activeSidebarItem === item.id ? 'active' : ''
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className={item.icon} />
              </div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <i className="ri-user-line ri-lg" />
            </div>
            <div>
              <div className="font-medium">관리자</div>
              <div className="text-xs text-gray-500">admin@camping.co.kr</div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200 transition whitespace-nowrap">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-logout-box-line" />
            </div>
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="ml-64 flex-1">
        {/* 상단 헤더 */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-medium">대시보드</h1>
            <div className="text-sm text-gray-500">{dateString}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-notification-line" />
                </div>
              </button>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-message-2-line" />
                </div>
              </button>
            </div>
            <div>
              <button className="py-2 px-4 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition whitespace-nowrap">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-question-line" />
                </div>
                <span>도움말</span>
              </button>
            </div>
          </div>
        </div>

        {/* 대시보드 내용 */}
        <div className="p-6">
          {/* 요약 카드 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">총 회원 수</div>
                  <div className="text-2xl font-bold mt-2">8,742</div>
                  <div className="flex items-center mt-2 text-sm">
                    <div className="text-green-500 flex items-center">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-arrow-up-line" />
                      </div>
                      <span>12.5%</span>
                    </div>
                    <span className="text-gray-500 ml-2">지난달 대비</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-user-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">등록된 숙박시설</div>
                  <div className="text-2xl font-bold mt-2">1,258</div>
                  <div className="flex items-center mt-2 text-sm">
                    <div className="text-green-500 flex items-center">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-arrow-up-line" />
                      </div>
                      <span>8.3%</span>
                    </div>
                    <span className="text-gray-500 ml-2">지난달 대비</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-hotel-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">이번 달 예약</div>
                  <div className="text-2xl font-bold mt-2">3,487</div>
                  <div className="flex items-center mt-2 text-sm">
                    <div className="text-green-500 flex items-center">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-arrow-up-line" />
                      </div>
                      <span>15.2%</span>
                    </div>
                    <span className="text-gray-500 ml-2">지난달 대비</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-calendar-check-line" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">이번 달 매출</div>
                  <div className="text-2xl font-bold mt-2">₩ 157,892,000</div>
                  <div className="flex items-center mt-2 text-sm">
                    <div className="text-red-500 flex items-center">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-arrow-down-line" />
                      </div>
                      <span>3.1%</span>
                    </div>
                    <span className="text-gray-500 ml-2">지난달 대비</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-money-cny-circle-line" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">월별 예약 현황</h2>
                <div className={`custom-select w-40 ${showYearSelect ? 'active' : ''}`}>
                  <div
                    className="custom-select-selected"
                    onClick={() => setShowYearSelect(!showYearSelect)}
                  >
                    <span>{selectedYear}</span>
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-arrow-down-s-line" />
                    </div>
                  </div>
                  <div className="custom-select-options">
                    {['2025년', '2024년', '2023년'].map((year) => (
                      <div
                        key={year}
                        className="custom-select-option"
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearSelect(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div ref={monthlyBookingsChartRef} style={{ width: '100%', height: 300 }} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">숙박시설 유형 분포</h2>
                <div className={`custom-select w-40 ${showPeriodSelect ? 'active' : ''}`}>
                  <div
                    className="custom-select-selected"
                    onClick={() => setShowPeriodSelect(!showPeriodSelect)}
                  >
                    <span>{selectedPeriod}</span>
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-arrow-down-s-line" />
                    </div>
                  </div>
                  <div className="custom-select-options">
                    {['전체 기간', '이번 달', '이번 해'].map((period) => (
                      <div
                        key={period}
                        className="custom-select-option"
                        onClick={() => {
                          setSelectedPeriod(period);
                          setShowPeriodSelect(false);
                        }}
                      >
                        {period}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div ref={accommodationTypeChartRef} style={{ width: '100%', height: 300 }} />
            </div>
          </div>

          {/* 회원 관리 섹션 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">회원 관리</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <div className="flex space-x-2">
                    {['all', 'normal', 'business'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveMemberTab(tab)}
                        className={`py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap ${
                          activeMemberTab === tab ? 'tab-active' : ''
                        }`}
                      >
                        <span>
                          {tab === 'all' ? '전체 회원' : tab === 'normal' ? '일반 회원' : '사업자 회원'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="회원 검색"
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                        <i className="ri-search-line" />
                      </div>
                    </div>
                    <button className="py-2 px-4 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-filter-line" />
                      </div>
                      <span>필터</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <label className="custom-checkbox">
                            <input type="checkbox" />
                            <span className="checkmark" />
                          </label>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          회원 정보
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          회원 유형
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          가입일
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: '김민준', email: 'minjun@example.com', type: '일반 회원', date: '2025-06-15', status: '활성', statusColor: 'green' },
                        { name: '박지영', email: 'jiyoung@example.com', type: '사업자 회원', date: '2025-05-22', status: '활성', statusColor: 'green' },
                        { name: '이서연', email: 'seoyeon@example.com', type: '일반 회원', date: '2025-07-01', status: '대기', statusColor: 'yellow' },
                        { name: '최현우', email: 'hyunwoo@example.com', type: '사업자 회원', date: '2025-04-18', status: '정지', statusColor: 'red' },
                        { name: '정도윤', email: 'doyun@example.com', type: '일반 회원', date: '2025-06-30', status: '활성', statusColor: 'green' }
                      ].map((member, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <label className="custom-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <i className="ri-user-line" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${member.statusColor}-100 text-${member.statusColor}-800`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-primary hover:text-primary-dark">상세</button>
                              <button className="text-gray-500 hover:text-gray-700">수정</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">총 8,742개 중 1-5 표시</div>
                  <div className="flex space-x-2">
                    <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-left-s-line" />
                      </div>
                      <span>이전</span>
                    </button>
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        className={`py-2 px-4 rounded-lg flex items-center space-x-2 transition whitespace-nowrap ${
                          page === 1
                            ? 'bg-primary text-white hover:bg-opacity-90'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{page}</span>
                      </button>
                    ))}
                    <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap">
                      <span>다음</span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-right-s-line" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 오류 섹션 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">결제 오류 관리</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <div className="flex space-x-2">
                    {['all', 'unresolved', 'resolved'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActivePaymentTab(tab)}
                        className={`py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap ${
                          activePaymentTab === tab ? 'tab-active' : ''
                        }`}
                      >
                        <span>
                          {tab === 'all' ? '모든 오류' : tab === 'unresolved' ? '미해결' : '해결됨'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="결제 ID 검색"
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400">
                        <i className="ri-search-line" />
                      </div>
                    </div>
                    <button className="py-2 px-4 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-filter-line" />
                      </div>
                      <span>필터</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제 ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회원 정보</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제 금액</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제 방법</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">오류 유형</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: '#PAY-25070812', name: '김민준', email: 'minjun@example.com', amount: '₩ 185,000', method: '신용카드', error: '결제 승인 실패', status: '미해결', statusColor: 'red' },
                        { id: '#PAY-25070809', name: '이서연', email: 'seoyeon@example.com', amount: '₩ 235,000', method: '카카오페이', error: '중복 결제', status: '처리 중', statusColor: 'yellow' },
                        { id: '#PAY-25070805', name: '박지영', email: 'jiyoung@example.com', amount: '₩ 150,000', method: '신용카드', error: '취소 처리 지연', status: '해결됨', statusColor: 'green' },
                        { id: '#PAY-25070801', name: '정도윤', email: 'doyun@example.com', amount: '₩ 320,000', method: '페이팔', error: '환불 처리 오류', status: '미해결', statusColor: 'red' }
                      ].map((payment, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-0">
                                <div className="text-sm font-medium text-gray-900">{payment.name}</div>
                                <div className="text-sm text-gray-500">{payment.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.amount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-6 h-6 flex items-center justify-center mr-2">
                                <i className={`ri-${payment.method === '신용카드' ? 'bank-card-fill text-blue-500' : payment.method === '카카오페이' ? 'kakao-talk-fill text-yellow-500' : 'paypal-fill text-blue-600'}`} />
                              </div>
                              <div className="text-sm text-gray-900">{payment.method}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{payment.error}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${payment.statusColor}-100 text-${payment.statusColor}-800`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className={`py-1 px-3 rounded-lg text-xs transition whitespace-nowrap ${
                              payment.status === '해결됨'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-primary text-white hover:bg-opacity-90'
                            }`}>
                              {payment.status === '해결됨' ? '상세보기' : '해결하기'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">총 24개 중 1-4 표시</div>
                  <div className="flex space-x-2">
                    <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-left-s-line" />
                      </div>
                      <span>이전</span>
                    </button>
                    {[1, 2].map((page) => (
                      <button
                        key={page}
                        className={`py-2 px-4 rounded-lg flex items-center space-x-2 transition whitespace-nowrap ${
                          page === 1
                            ? 'bg-primary text-white hover:bg-opacity-90'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{page}</span>
                      </button>
                    ))}
                    <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap">
                      <span>다음</span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-right-s-line" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI 컨텐츠 관리 섹션 */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium">AI 컨텐츠 관리</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">AI 홍보글 생성</h3>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          id="ai-content-toggle"
                          checked={aiContentToggle}
                          onChange={(e) => setAiContentToggle(e.target.checked)}
                        />
                        <span className="toggle-slider" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      숙박시설 정보를 기반으로 자동으로 홍보글을 생성합니다. 주변 관광지와 맛집 정보를 포함합니다.
                    </p>
                    <div className="flex space-x-2">
                      <button className="py-2 px-4 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition whitespace-nowrap">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-settings-line" />
                        </div>
                        <span>설정</span>
                      </button>
                      <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-history-line" />
                        </div>
                        <span>생성 기록</span>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">이미지 자동 최적화</h3>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          id="image-optimize-toggle"
                          checked={imageOptimizeToggle}
                          onChange={(e) => setImageOptimizeToggle(e.target.checked)}
                        />
                        <span className="toggle-slider" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      업로드된 이미지를 자동으로 리사이징하고 최적화하여 앱에 적합한 형태로 변환합니다.
                    </p>
                    <div className="flex space-x-2">
                      <button className="py-2 px-4 bg-primary text-white rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition whitespace-nowrap">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-settings-line" />
                        </div>
                        <span>설정</span>
                      </button>
                      <button className="py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition whitespace-nowrap">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-image-line" />
                        </div>
                        <span>갤러리</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">최근 생성된 AI 컨텐츠</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">숙박시설</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">컨텐츠 유형</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { facility: '산들바람 글램핑', type: '홍보글 + 이미지', date: '2025-07-08', status: '게시됨', statusColor: 'green' },
                          { facility: '숲속의 작은집', type: '홍보글', date: '2025-07-07', status: '검토 중', statusColor: 'yellow' },
                          { facility: '바다가 보이는 펜션', type: '이미지 최적화', date: '2025-07-06', status: '게시됨', statusColor: 'green' }
                        ].map((content, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{content.facility}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{content.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{content.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${content.statusColor}-100 text-${content.statusColor}-800`}>
                                {content.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-primary hover:text-primary-dark">보기</button>
                                <button className="text-gray-500 hover:text-gray-700">수정</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
