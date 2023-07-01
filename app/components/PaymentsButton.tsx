import { useEffect, useRef, useState } from "react";
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
} from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useAsync } from "react-use";

const clientKey = "test_ck_LBa5PzR0ArnjEe4jEKXrvmYnNeDM";
const customerKey = "";

export default function Home() {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
  PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);

  const [price, setPrice] = useState(50_000);

  useAsync(async () => {
    const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      price
    );

    paymentWidgetRef.current = paymentWidget;
    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, []);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON
    );
  }, [price]);

  return (
    <main
    className="
    flex
    flex-col
    justify-center
    items-center"
    >
      <h1>주문서</h1>
      <span>{`${price.toLocaleString()}원`}</span>
      <div>
        <label>
          <input
          type="checkbox"
          onChange={(event) => {
            setPrice(event.target.checked ? price - 5_000 : price + 5_000);
          }}
          />
          5,000원 할인 쿠폰 적용
        </label>
      </div>
      <div id="payment-widget">
        <button
        onClick = {async () => {
          const paymentwidget = paymentWidgetRef.current;

          try {
            await paymentwidget?.requestPayment({
              orderId: nanoid(),
              orderName: "토스 티셔츠 외 2건",
              customerName: "김토스",
              customerEmail: "customer123@gmail.com",
              successUrl: `${window.location.origin}/sucess`,
              failUrl: `${window.location.origin}/fail`,
            });
          } catch(error) {
            console.log(error);
          }
        }}
        >
          결제하기
        </button>
      </div>
    </main>
  );
}