import './DescriptionHeader.scss';
const DescriptionHeader = ({descricao}) => {
    return (
        <div className="description-header">
            <span>{descricao}</span>
        </div>
    )
}
export default DescriptionHeader;