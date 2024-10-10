import styled from "styled-components";

export const ActivityStyles = styled.div`
.container{
    width: 900px;
    
    .header {
    display: flex;
    align-items: center;
    }

    .title {
    display: inline-block; 
    font-size: 20px;
    border-bottom: 1px solid black; 
    padding-bottom: 5px; 
    width: calc(100% - 40px); 
    }   

    .workspaces{
        .header {
        }
        
        .list-workspace{
            width: 100%;
            padding: 5px;
            border-bottom: 1px solid black; 
            margin-left: 25px;
            a{
                color: black;
                text-decoration: none;
                font-size: 14px;
                margin-left: 10px;
                margin: 10px;
            }
        }
    }

    .activity{
        margin-top: 30px;

        .header{
        margin-bottom: 10px;
        }

        .text-link-card:hover{
            text-decoration: underline;
        }
    }


}
`