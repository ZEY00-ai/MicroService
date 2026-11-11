const rupiah = new Intl.NumberFormat('id-ID',{
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
})

export const formatRupiah = (value) => rupiah.format(Number(value))

export function getProductImage(image) {
    if (image.startsWith('data:') || image.startsWith('http')) return image
    return `data:image/png;base64,${image}`
}

export function describeError(error) {
    const errors = error?.errors ?? error?.error
    const detail = errors
        ? typeof errors === 'object'
            ? Object.values(errors).flat()
            : [errors]
        : []

    const message = error?.message || 'Terjadi kesalahan.'
    return detail.length ? `${message}: ${detail.join(', ')}` : message
}