import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import styles from '../styles/Modal.module.css';

const InvoiceModal = ({ show, onHide, invoice }) => {
  if (!invoice) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="invoice-modal"
      centered
      dialogClassName={styles.modalContent}
      contentClassName={styles.modalAnimation}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title id="invoice-modal" className={styles.modalTitle}>
          Invoice Details - {invoice.invoiceNumber}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <div className="invoice-details">
          <Table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.labelColumn}>Vendor Name</td>
                <td className={styles.valueColumn}>{invoice.vendorName}</td>
              </tr>
              <tr>
                <td className={styles.labelColumn}>Invoice Number</td>
                <td className={styles.valueColumn}>{invoice.invoiceNumber}</td>
              </tr>
              <tr>
                <td className={styles.labelColumn}>Date</td>
                <td className={styles.valueColumn}>
                  {new Date(invoice.date).toLocaleDateString()} {invoice.time}
                </td>
              </tr>
              <tr>
                <td className={styles.labelColumn}>Product Name</td>
                <td className={styles.valueColumn}>{invoice.productName}</td>
              </tr>
              <tr>
                <td className={styles.labelColumn}>SKU/IMEI</td>
                <td className={styles.valueColumn}>{invoice.imeiSku}</td>
              </tr>
              <tr>
                <td className={styles.labelColumn}>Warranty End Date</td>
                <td className={styles.valueColumn}>
                  {new Date(invoice.warrantyEndDate).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </Table>
          
          {invoice.fileUrl && (
            <div className="text-center mt-4">
              <Button 
                className={styles.downloadButton}
                href={`/api/invoices/${invoice._id}/download`}
                target="_blank"
              >
                📥 Download Invoice
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button variant="secondary" onClick={onHide} className={styles.closeModalButton}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal; 