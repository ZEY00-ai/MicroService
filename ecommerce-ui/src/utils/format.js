const rupiah = new Intl.NumberFormat('id-ID',{
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
})

export const formatRupiah = (value) => rupiah.format(Number(value))

export function describeError(error) {
    const detail = error.errors ? Object.values(error.errors).flat() : []

    return detail.length ? `${error.message}: ${details.join(', ')}` : error.message
}