import { supabase } from '../lib/supabase';

const ADMIN_ID =
'9461bc2b-70e1-4edd-bb3c-85d2973def6c';

export async function criarAlertaAdmin(
usuarioId: string,
usuarioNome: string,
tipo: string,
descricao: string
) {

const { error } =
await supabase
.from('alertas_admin')
.insert({


    usuario_id:
      usuarioId,

    usuario_nome:
      usuarioNome,

    tipo,

    descricao,

    lido: false,

  });


if (error) {
console.log(
'Erro alerta admin:',
error
);
}
}
