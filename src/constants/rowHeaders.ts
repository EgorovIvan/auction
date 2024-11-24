import {auctionData} from "../pages/Auction/Auction.tsx";

export interface RowHeader {
    key: keyof auctionData;
    label: string;
}

export const rowHeaders: RowHeader[] = [
    { key: 'availability', label: 'Наличие комплекса мероприятий' },
    { key: 'manufacturingTime', label: 'Срок изготовления лота, мес' },
    { key: 'warrantyObligations', label: 'Гарантия обязательства, мес' },
    { key: 'paymentTerms', label: 'Условия оплаты, %' },
    { key: 'price', label: 'Стоимость изготовления лота, руб. (без НДС)' },
];