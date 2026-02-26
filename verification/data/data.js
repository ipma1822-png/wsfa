/* WSFA Verification Data (sample)
   - Replace with your real records
   - code: unique identifier
   - status: VALID | EXPIRED | REVOKED (원하는 값으로 확장 가능)
*/
window.WSFA_VERIFY_DATA = {
  updated_at: "2026-02-27",
  records: [
    {
      code: "WSFA-2026-0001",
      holder: "홍길동",
      type: "어린이 안전 교육 참여",
      issuer: "세계안전미래재단(WSFA)",
      issued_at: "2026-02-20",
      valid_until: "",
      status: "VALID",
      note: "현장 교육 참여 기록"
    },
    {
      code: "WSFA-2026-0002",
      holder: "김철수",
      type: "안전허브 캠페인 참여",
      issuer: "세계안전미래재단(WSFA)",
      issued_at: "2026-02-22",
      valid_until: "",
      status: "VALID",
      note: "QR 캠페인 참여"
    },
    {
      code: "WSFA-2025-0100",
      holder: "샘플기관",
      type: "협력기관 등록",
      issuer: "세계안전미래재단(WSFA)",
      issued_at: "2025-11-01",
      valid_until: "2026-11-01",
      status: "VALID",
      note: "기관 협력 샘플"
    }
  ]
};
