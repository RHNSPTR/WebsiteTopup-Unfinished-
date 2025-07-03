document.addEventListener('DOMContentLoaded', () => {

    // Cek apakah kita di halaman transaksi (ini berlaku untuk semua halaman di folder /games/)
    if (document.querySelector('.transaction-page')) {
        const nominalGrid = document.getElementById('nominal-grid');
        const paymentGrid = document.getElementById('payment-grid');
        const buyButton = document.getElementById('buy-button');
        const modal = document.getElementById('confirmation-modal');
        const modalSummary = document.getElementById('modal-summary');
        const confirmButton = document.getElementById('confirm-purchase');
        const cancelButton = document.getElementById('cancel-purchase');

        let selectedNominal = null;
        let selectedPayment = null;

        const handleItemSelection = (grid, isNominal) => {
            grid.addEventListener('click', (e) => {
                const item = e.target.closest('.item');
                if (!item) return;

                const selected = grid.querySelector('.item.selected');
                if (selected) {
                    selected.classList.remove('selected');
                }

                item.classList.add('selected');

                if (isNominal) {
                    selectedNominal = {
                        name: item.dataset.name,
                        price: parseInt(item.dataset.price)
                    };
                } else {
                    selectedPayment = {
                        name: item.dataset.name
                    };
                }
            });
        };

        handleItemSelection(nominalGrid, true);
        handleItemSelection(paymentGrid, false);

        // Fungsi saat tombol "Beli Sekarang" diklik
        buyButton.addEventListener('click', () => {
            const userIdInput = document.getElementById('userId');
            const zoneIdInput = document.getElementById('zoneId'); // Ambil elemen Zone ID
            const whatsappInput = document.getElementById('whatsapp');

            const userId = userIdInput.value;
            const whatsapp = whatsappInput.value;
            
            // ===== PERUBAHAN UTAMA ADA DI SINI =====
            // Validasi: Cek apakah input Zone ID ada di halaman ini
            let zoneId = null;
            let isZoneIdValid = true; // Anggap valid secara default
            if (zoneIdInput) { // Jika elemen Zone ID ADA
                zoneId = zoneIdInput.value;
                if (!zoneId) { // Jika ada TAPI kosong, maka tidak valid
                    isZoneIdValid = false;
                }
            }
            // ========================================

            // Validasi input dasar
            if (!userId) {
                alert('Harap isi User ID / Player ID / Username Anda.');
                return;
            }
            
            // Validasi Zone ID hanya jika inputnya ada dan kosong
            if (!isZoneIdValid) {
                alert('Harap isi Zone ID / Server Anda.');
                return;
            }

            if (!selectedNominal) {
                alert('Harap pilih nominal top up.');
                return;
            }
            if (!selectedPayment) {
                alert('Harap pilih metode pembayaran.');
                return;
            }
            if (!whatsapp) {
                alert('Harap isi nomor WhatsApp Anda.');
                return;
            }

            // Menyiapkan ringkasan untuk modal
            const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(selectedNominal.price);
            
            let userDetailHtml = `<p><strong>User ID:</strong> <span>${userId}</span></p>`;
            // Jika Zone ID ada dan diisi, tampilkan di modal
            if (zoneId) {
                userDetailHtml = `<p><strong>User ID:</strong> <span>${userId} (${zoneId})</span></p>`;
            }

            modalSummary.innerHTML = `
                ${userDetailHtml}
                <p><strong>Item:</strong> <span>${selectedNominal.name}</span></p>
                <p><strong>Pembayaran:</strong> <span>${selectedPayment.name}</span></p>
                <p><strong>Total:</strong> <span>${formattedPrice}</span></p>
            `;
            
            modal.classList.add('active');
        });

        const closeModal = () => {
            modal.classList.remove('active');
        }

        cancelButton.addEventListener('click', closeModal);

        confirmButton.addEventListener('click', () => {
            alert('Pembelian Berhasil! (Ini hanya demo). Halaman akan disegarkan.');
            closeModal();
            location.reload(); 
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});