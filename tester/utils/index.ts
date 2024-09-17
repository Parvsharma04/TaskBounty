export const BACKEND_URL = "http://localhost:3000";
export const CLOUDFRONT_URL = "https://d2evdzd5kkyi1f.cloudfront.net";

export default async function getToken() {
  if (wallet.connected) {
    try {
      const message = new TextEncoder().encode("verify this to authenticate");
      const signature = await wallet.signMessage?.(message);
      let response = await axios.post(`${BACKEND_URL}/v0/worker/signin`, {
        signature,
        publicKey: wallet.publicKey?.toString(),
      });
      localStorage.setItem("token", response.data.token);

      setPayoutAmt(response.data.amount);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  } else if (!wallet.connected) {
    localStorage.clear();
  }
}

export const handlePayoutAmt = async () => {
  try {
    let response = await axios.post(
      `${BACKEND_URL}/v1/worker/payout`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data);
    setPayoutAmt(response.data.amount);
    toast.success(response.data.message);
  } catch (error: any) {
    toast.error(error.response.data.message);
    console.error("Error processing payout:", error);
  }
};

export const handleLinkClick = () => {
  setMenuOpen(false);
};

export const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
    setMenuOpen(false);
  }
};
