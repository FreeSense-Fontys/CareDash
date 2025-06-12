interface EditButtonProps {
    handleEditConfiguration: () => void
}

const EditButton = ({ handleEditConfiguration }: EditButtonProps) => {
    return (
        <div className="flex justify-end">
            <button
                className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent"
                onClick={handleEditConfiguration}
            >
                Edit
            </button>
        </div>
    )
}

export default EditButton
