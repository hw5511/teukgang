export type NapoleonScene = {
  id: number;
  image: string;
  audio: string;
  caption: string;
  narration: string;
  timedCaptions: string[];
};

export const napoleonScenes: NapoleonScene[] = [
  {
    id: 1,
    image: "images/scene-01.png",
    audio: "audio/scene-01.wav",
    caption: "황제가 토끼에게 밀린 날",
    narration:
      "세계사를 뒤흔든 남자 나폴레옹에게도, 평생 잊기 어려운 아주 작고 복슬복슬한 적들이 있었습니다.",
    timedCaptions: [
      "세계사를 뒤흔든 남자",
      "나폴레옹에게도",
      "평생 잊기 어려운",
      "아주 작고 복슬복슬한",
      "적들이 있었습니다",
    ],
  },
  {
    id: 2,
    image: "images/scene-02.png",
    audio: "audio/scene-02.wav",
    caption: "1807년, 축하 사냥",
    narration:
      "1807년 틸지트 조약 뒤, 참모들은 황제의 기분을 띄우려고 성대한 토끼 사냥 행사를 준비했다고 전해집니다.",
    timedCaptions: [
      "1807년 틸지트 조약 뒤",
      "참모들은 황제의",
      "기분을 띄우려고",
      "성대한 토끼 사냥을",
      "준비했다고 전해집니다",
    ],
  },
  {
    id: 3,
    image: "images/scene-03.png",
    audio: "audio/scene-03.wav",
    caption: "문제는 토끼의 출신",
    narration:
      "그런데 참모 베르티에는 야생 토끼가 아니라, 사람에게 길든 집토끼들을 잔뜩 사 모으는 실수를 했습니다.",
    timedCaptions: [
      "그런데 참모 베르티에는",
      "야생 토끼가 아니라",
      "사람에게 길든 집토끼를",
      "잔뜩 사 모으는",
      "실수를 했습니다",
    ],
  },
  {
    id: 4,
    image: "images/scene-04.png",
    audio: "audio/scene-04.wav",
    caption: "사냥감이 달려온다",
    narration:
      "우리에서 풀려난 토끼들은 도망치기는커녕, 먹이를 주는 사람이 온 줄 알고 나폴레옹 쪽으로 우르르 달려왔습니다.",
    timedCaptions: [
      "우리에서 풀려난 토끼들은",
      "도망치기는커녕",
      "먹이를 주는 사람이",
      "온 줄 알고",
      "우르르 달려왔습니다",
    ],
  },
  {
    id: 5,
    image: "images/scene-05.png",
    audio: "audio/scene-05.wav",
    caption: "황제보다 밥이 중요했다",
    narration:
      "제국의 군대가 두려워하던 황제도, 당근을 기대하는 토끼들의 집요한 눈빛 앞에서는 꽤 당황했겠죠.",
    timedCaptions: [
      "제국의 군대가 두려워하던",
      "황제도",
      "당근을 기대하는",
      "토끼들의 눈빛 앞에서는",
      "꽤 당황했겠죠",
    ],
  },
  {
    id: 6,
    image: "images/scene-06.png",
    audio: "audio/scene-06.wav",
    caption: "참모들의 대혼란",
    narration:
      "참모들은 모자와 채찍을 흔들며 토끼들을 쫓아내려 했지만, 길든 토끼들은 오히려 더 친근하게 몰려들었습니다.",
    timedCaptions: [
      "참모들은 모자와 채찍을",
      "흔들며 쫓아냈지만",
      "길든 토끼들은",
      "오히려 더 친근하게",
      "몰려들었습니다",
    ],
  },
  {
    id: 7,
    image: "images/scene-07.png",
    audio: "audio/scene-07.wav",
    caption: "전략적 후퇴",
    narration:
      "결국 나폴레옹은 전장을 정복하던 기세를 잠시 접고, 마차 안으로 물러나는 선택을 했다고 합니다.",
    timedCaptions: [
      "결국 나폴레옹은",
      "전장을 정복하던 기세를",
      "잠시 접고",
      "마차 안으로",
      "물러났다고 합니다",
    ],
  },
  {
    id: 8,
    image: "images/scene-08.png",
    audio: "audio/scene-08.wav",
    caption: "역사는 가끔 귀엽다",
    narration:
      "이 이야기가 조금 과장됐을 수도 있지만, 역사에는 이렇게 거대한 인물도 작게 보이게 만드는 순간이 숨어 있습니다.",
    timedCaptions: [
      "조금 과장됐을 수도 있지만",
      "역사에는 이렇게",
      "거대한 인물도",
      "작게 보이게 만드는",
      "순간이 숨어 있습니다",
    ],
  },
];
