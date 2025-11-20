export const MBTI_TYPES = [
  { type: 'ISTJ', desc: '청렴결백한 논리주의자' },
  { type: 'ISFJ', desc: '용감한 수호자' },
  { type: 'INFJ', desc: '선의의 옹호자' },
  { type: 'INTJ', desc: '용의주도한 전략가' },
  { type: 'ISTP', desc: '만능 재주꾼' },
  { type: 'ISFP', desc: '호기심 많은 예술가' },
  { type: 'INFP', desc: '열정적인 중재자' },
  { type: 'INTP', desc: '논리적인 사색가' },
  { type: 'ESTP', desc: '모험을 즐기는 사업가' },
  { type: 'ESFP', desc: '자유로운 영혼의 연예인' },
  { type: 'ENFP', desc: '재기발랄한 활동가' },
  { type: 'ENTP', desc: '뜨거운 논쟁을 즐기는 변론가' },
  { type: 'ESTJ', desc: '엄격한 관리자' },
  { type: 'ESFJ', desc: '사교적인 외교관' },
  { type: 'ENFJ', desc: '정의로운 사회운동가' },
  { type: 'ENTJ', desc: '대담한 통솔자' },
];

export const REGIONS = [
  { name: '서울', desc: '강남, 홍대, 명동', icon: 'ri-building-4-line' },
  { name: '경기도', desc: '가평, 양평, 포천', icon: 'ri-building-line' },
  { name: '강원도', desc: '춘천, 홍천, 평창', icon: 'ri-mountain-line' },
  { name: '충청북도', desc: '청주, 충주, 제천', icon: 'ri-landscape-line' },
  { name: '충청남도', desc: '천안, 아산, 공주', icon: 'ri-landscape-line' },
  { name: '전라북도', desc: '전주, 군산, 익산', icon: 'ri-water-percent-line' },
  { name: '전라남도', desc: '여수, 순천, 광양', icon: 'ri-water-percent-line' },
  { name: '경상북도', desc: '포항, 경주, 안동', icon: 'ri-sun-line' },
  { name: '경상남도', desc: '창원, 진주, 통영', icon: 'ri-sun-line' },
  { name: '제주도', desc: '제주시, 서귀포시', icon: 'ri-flight-takeoff-line' },
  { name: '부산', desc: '해운대, 광안리', icon: 'ri-ship-line' },
  { name: '대구', desc: '수성구, 달서구', icon: 'ri-building-2-line' },
  { name: '인천', desc: '송도, 영종도', icon: 'ri-ship-2-line' },
  { name: '광주', desc: '충장로, 상무지구', icon: 'ri-building-3-line' },
  { name: '대전', desc: '유성구, 중구', icon: 'ri-building-line' },
  { name: '울산', desc: '남구, 동구', icon: 'ri-building-2-line' },
  { name: '세종', desc: '새롬동, 도담동', icon: 'ri-government-line' },
];

export const CAMPING_STYLES = [
  {
    style: '캠핑',
    desc: '자연 속에서 텐트와 함께',
    image:
      'https://readdy.ai/api/search-image?query=3D%20rendered%20camping%20tent%20icon%20with%20campfire%2C%20outdoor%20adventure%20style%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=80&height=80&seq=41&orientation=squarish',
  },
  {
    style: '글램핑',
    desc: '편안한 럭셔리 캠핑',
    image:
      'https://readdy.ai/api/search-image?query=3D%20rendered%20luxury%20glamping%20dome%20tent%20icon%2C%20premium%20camping%20experience%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=80&height=80&seq=42&orientation=squarish',
  },
  {
    style: '카라반',
    desc: '이동식 숙박 체험',
    image:
      'https://readdy.ai/api/search-image?query=3D%20rendered%20caravan%20trailer%20icon%2C%20mobile%20home%20camping%20style%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=80&height=80&seq=43&orientation=squarish',
  },
  {
    style: '펜션',
    desc: '프라이빗한 독채 숙박',
    image:
      'https://readdy.ai/api/search-image?query=3D%20rendered%20pension%20house%20icon%2C%20cozy%20accommodation%20building%2C%20minimalist%20design%2C%20soft%20gradient%20colors%2C%20flat%20style%20with%20depth%2C%20centered%20composition%2C%20clean%20white%20background%2C%20modern%20UI%20icon&width=80&height=80&seq=44&orientation=squarish',
  },
];

export const FACILITIES = ['수영장', '바베큐장', '와이파이', '주차장'];
export const PURPOSES = ['휴식 및 힐링', '가족 여행', '친구들과 모임', '커플 여행'];

export const PEOPLE_OPTIONS = [
  { value: '1인', icon: 'ri-user-line' },
  { value: '2인', icon: 'ri-user-2-line' },
  { value: '3-4인', icon: 'ri-team-line' },
  { value: '5인 이상', icon: 'ri-group-2-line' },
];

export const BUDGET_OPTIONS = [
  { value: 10, label: '10만원', desc: '경제적' },
  { value: 20, label: '20만원', desc: '추천' },
  { value: 35, label: '35만원', desc: '프리미엄' },
];

export const RESULT_CARDS = [
  {
    title: '가평 프리미엄 글램핑',
    region: '경기도 가평군 청평면 대성리',
    price: 180000,
    rating: '4.8',
    description: '자연 속 럭셔리 글램핑 체험',
    distance: '차량 1시간',
    facilities: '수영장,바베큐장,와이파이',
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20glamping%20tent%20with%20panoramic%20windows%20surrounded%20by%20forest%2C%20premium%20camping%20experience%2C%20cozy%20interior%20lighting%2C%20evening%20atmosphere%2C%20professional%20photography&width=800&height=400&seq=51&orientation=landscape',
    badge: 'AI 추천',
  },
  {
    title: '양평 힐링 글램핑',
    region: '경기도 양평군 양서면 용담리',
    price: 150000,
    rating: '4.6',
    description: '계곡 옆 힐링 글램핑',
    distance: '차량 50분',
    facilities: '바베큐장,와이파이,주차장',
    image:
      'https://readdy.ai/api/search-image?query=Modern%20glamping%20dome%20with%20mountain%20view%2C%20luxury%20outdoor%20accommodation%2C%20comfortable%20interior%20setup%2C%20sunset%20lighting%2C%20high-quality%20photography&width=800&height=400&seq=52&orientation=landscape',
    badge: '인기',
  },
  {
    title: '포천 숲속 글램핑',
    region: '경기도 포천시 내촌면 금현리',
    price: 160000,
    rating: '4.7',
    description: '숲속 프라이빗 글램핑',
    distance: '차량 1시간 10분',
    facilities: '바베큐장,와이파이',
    image:
      'https://readdy.ai/api/search-image?query=Cozy%20glamping%20tent%20with%20private%20deck%2C%20forest%20setting%2C%20romantic%20atmosphere%2C%20warm%20interior%20lighting%2C%20couple-friendly%20accommodation&width=800&height=400&seq=53&orientation=landscape',
    badge: '',
  },
];
