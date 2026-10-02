// js/rooms.js
export const ROOMS = [
    {
        id: "battleroom1",
        no: 1,
        name: "SIMULATION CHAMBER 1",
        bg: null,
    },
    {
        id: "battleroom2",
        no: 2,
        name: "SIMULATION CHAMBER 2",
        bg: null,
    },
    {
        id: "battleroom3",
        no: 3,
        name: "SIMULATION CHAMBER 3",
        bg: null,
    },
];

export function roomInfo(roomId) {
  return ROOMS.find((r) => r.id === roomId);
}

export function roomBgStyle(info, imgBase) {
  return info?.bg ? `url("${imgBase}${info.bg}")` : "";
}

export function roomStatus(room) {
  if (!room) return { key: "closed", label: "준비 중" };
  if (room.battle_winner) return { key: "ended", label: "게임 종료" };
  if (room.game_started) return { key: "playing", label: "게임 중" };
  return { key: "waiting", label: "대기 중" };
}