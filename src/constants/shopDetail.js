export const ROOMS = [
  {
    id: 'premium',
    name: '프리미엄 글램핑 텐트',
    price: 180000,
    capacity: '기준 2인 / 최대 4인',
    area: '40㎡ (퀸 베드 1, 소파베드 1)',
    image:
      'https://readdy.ai/api/search-image?query=luxury%20glamping%20tent%20exterior%20with%20wooden%20deck%2C%20forest%20view%2C%20premium%20accommodation&width=375&height=200&seq=13&orientation=landscape',
  },
  {
    id: 'standard',
    name: '스탠다드 글램핑 텐트',
    price: 150000,
    capacity: '기준 2인 / 최대 3인',
    area: '30㎡ (퀸 베드 1)',
    image:
      'https://readdy.ai/api/search-image?query=standard%20glamping%20tent%20exterior%20with%20small%20deck%2C%20cozy%20setting%2C%20standard%20accommodation&width=375&height=200&seq=14&orientation=landscape',
  },
  {
    id: 'family',
    name: '패밀리 글램핑 텐트',
    price: 250000,
    capacity: '기준 4인 / 최대 6인',
    area: '60㎡ (퀸 베드 2, 소파베드 1)',
    image:
      'https://readdy.ai/api/search-image?query=family%20glamping%20tent%20exterior%20with%20large%20deck%2C%20spacious%20setting%2C%20family%20accommodation&width=375&height=200&seq=15&orientation=landscape',
  },
  {
    id: 'dome',
    name: '스타게이징 돔',
    price: 200000,
    capacity: '기준 2인 / 최대 2인',
    area: '25㎡ (퀸 베드 1)',
    image:
      'https://readdy.ai/api/search-image?query=romantic%20glamping%20dome%20with%20transparent%20ceiling%20for%20stargazing%2C%20couple%20retreat&width=375&height=200&seq=16&orientation=landscape',
  },
  {
    id: 'treehouse',
    name: '트리하우스',
    price: 220000,
    capacity: '기준 2인 / 최대 3인',
    area: '35㎡ (퀸 베드 1, 싱글 베드 1)',
    image:
      'https://readdy.ai/api/search-image?query=treehouse%20glamping%20accommodation%20with%20forest%20view%2C%20elevated%20wooden%20structure&width=375&height=200&seq=17&orientation=landscape',
  },
  {
    id: 'deluxe',
    name: '디럭스 글램핑 텐트',
    price: 130000,
    capacity: '기준 2인 / 최대 3인',
    area: '25㎡ (퀸 베드 1)',
    image:
      'https://readdy.ai/api/search-image?query=luxury%20glamping%20tent%20exterior%20with%20wooden%20deck%20at%20sunset&width=375&height=200&seq=18&orientation=landscape',
  },
];

export const INITIAL_REVIEWS = [
  {
    user: '김지현',
    date: '2025.07.01',
    rating: 5,
    text: '자연 속에서 편안하게 쉴 수 있는 최고의 장소였어요. 텐트 내부도 깨끗하고 아늑했고, 특히 밤에 보이는 별이 정말 환상적이었습니다. 직원분들도 친절하게 응대해주셔서 더욱 만족스러웠습니다. 다음에 또 방문하고 싶어요!'
  },
  {
    user: '박민준',
    date: '2025.06.15',
    rating: 4,
    text: '가족과 함께 패밀리 텐트에서 2박 했는데 아이들이 정말 좋아했어요. 바비큐 시설도 잘 되어 있고, 주변 환경도 깨끗해서 만족스러웠습니다. 다만 주말에는 사람이 많아 조금 시끄러웠던 점이 아쉬웠어요.'
  },
  {
    user: '이서연',
    date: '2025.06.10',
    rating: 4.5,
    text: '스타게이징 돔에서 남자친구와 특별한 기념일을 보냈어요. 투명한 천장으로 보이는 밤하늘이 정말 로맨틱했습니다. 시설도 깨끗하고 프라이빗한 공간이 보장되어 좋았어요. 다만 욕실이 조금 좁은 느낌이 있었지만, 전체적으로는 매우 만족스러웠습니다!'
  }
];

export const MORE_REVIEWS = [
  {
    user: '홍길동',
    date: '2025.05.20',
    rating: 5,
    text: '자연 속 글램핑이 예상보다 훨씬 좋았습니다! 텐트 내부가 깨끗하고 침구도 포근했으며, 밤에는 반짝이는 별빛 아래 캠프파이어를 즐길 수 있어 정말 로맨틱했어요. 아침에는 새소리와 함께 눈을 뜨고, 준비된 조식도 깔끔하고 맛있었습니다. 직원분들의 친절한 안내 덕분에 불편함 없이 편안하게 지낼 수 있었습니다. 다음에도 꼭 다시 방문하고 싶습니다!'
  },
  {
    user: '유재석',
    date: '2025.05.18',
    rating: 4.5,
    text: '가족 여행으로 글램핑장을 이용했는데 모두가 만족했어요. 아이들이 뛰어놀 수 있는 안전한 산책로와 넓은 데크 공간이 있어서 마음 놓고 시간을 보낼 수 있었습니다. 텐트마다 준비된 조명과 전기시설 덕분에 편리했고, 주변 경관이 아름다워 사진도 많이 찍었어요. 다만 주말이라 다소 북적였던 점만 빼면 전체적으로 완벽한 힐링이었습니다.'
  },
  {
    user: '강호동',
    date: '2025.05.15',
    rating: 4,
    text: '고즈넉한 숲속에서 보내는 시간이 정말 소중했습니다. 아침 일찍 일어나 산책로를 따라 걸으며 마주친 청량한 공기와 새소리가 아직도 생생하네요. 저녁에는 모닥불을 피우고 고기를 구워먹으며 친구들과 좋은 시간을 보냈습니다. 화장실과 샤워실도 깔끔하게 관리되고 있어 전혀 불편함이 없었습니다.'
  }
];

export const QUERIES = [
  {
    question: '바베큐 장비 대여 가능한가요?',
    answer: '프리미엄 텐트 이용 시 기본 바베큐 장비가 제공되며, 스탠다드 텐트는 현장에서 대여 가능합니다.'
  },
  {
    question: '입실/퇴실 시간이 어떻게 되나요?',
    answer: '입실은 오후 3시부터, 퇴실은 오전 11시까지입니다.'
  },
  {
    question: '반려동물 동반이 가능한가요?',
    answer: '특정 펫 전용 텐트에서만 반려동물 동반이 가능합니다.'
  }
];
