import React, {Component, PropTypes} from 'react';

// download html2canvas and jsPDF and save the files in app/ext, or somewhere else
// the built versions are directly consumable
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FaPrint from 'react-icons/lib/fa/print';

export default class Export extends Component {
  constructor(props) {
    super(props);
    this.printDocument = this.printDocument.bind(this);
  }

  printDocument() {
    const divName = this.props.divName;
    const input = document.getElementById(divName);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
      })
    ;
  }

  render() {
    return (
    <FaPrint color='black' style = { {fontSize: '22px', marginLeft: '12px'}} onClick={this.printDocument} />);
  }
}